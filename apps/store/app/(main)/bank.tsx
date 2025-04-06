import {
  Loading,
  MainOverview,
  useMutation,
  useQuery,
  useQueryClient,
  useTRPC,
  ViewComponent,
} from "@pkg/ui";
import { useAppForm } from "@pkg/ui/components/form/util";
import { IndianBankDetailsSchema, type IndianBankDetails } from "@repo/bg";
import { View} from "react-native";

export default function Bank() {
  const trpc = useTRPC();
  const { isLoading, data } = useQuery(trpc.bank.getBankDetails.queryOptions());
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation(
    trpc.bank.editBankDetails.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: trpc.bank.getBankDetails.queryKey(),
        });
      },
    })
  );
  const form = useAppForm({
    defaultValues: {
      IFSC: data ? data.IFSC : "",
      AccountNumber: data ? data.AccountNumber : "",
      BankName: data ? data.BankName : "",
      UPI: data ? data.UPI : "",
      BranchName: data ? data.BranchName : "",
    } as IndianBankDetails,
    validators: {
      onChange: IndianBankDetailsSchema,
    },
    onSubmit: ({ value }) => {
      mutate(value);
    },
  });
  return (
    <ViewComponent className="flex-1 p-6 gap-4">
      <Loading
        isloading={isLoading}
        source={require("@/assets/loading-3.json")}
      >
        <MainOverview
          title="Add Your Bank Details"
          description="Enter your account information to receive payments directly from customer orders. Make sure the details are accurate to avoid delays."
        />
        <form.AppField
          name="AccountNumber"
          children={(f) => {
            return <f.Input placeholder="Account Number" />;
          }}
        />
        <form.AppField
          name="IFSC"
          children={(f) => {
            return <f.Input placeholder="IFSC" />;
          }}
        />
        <form.AppField
          name="BankName"
          children={(f) => {
            return <f.Input placeholder="Bank Name" />;
          }}
        />
        <form.AppField
          name="BranchName"
          children={(f) => {
            return <f.Input placeholder="Branch Name" />;
          }}
        />
        <form.AppField
          name="UPI"
          children={(f) => {
            return <f.Input placeholder="UPI" />;
          }}
        />
        <View className="flex-1  justify-end ">
          <form.AppForm>
            <form.Submit
              onPress={form.handleSubmit}
              text="Save Bank Details"
              isSubmitting={isPending}
            />
          </form.AppForm>
        </View>
      </Loading>
    </ViewComponent>
  );
}
