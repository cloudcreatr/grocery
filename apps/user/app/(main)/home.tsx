import { Ionicons } from "@expo/vector-icons";
import {
  ActivityIndicator,
  Loading,
  MainOverview,
  Modal,
  ProductCard,
  QuickActionRow,
  ScrollViewComponent,
  TextComponent,
  useQuery,
  useTRPC,
} from "@pkg/ui";
import { Link, useRouter } from "expo-router";
import { use, useEffect, useState } from "react";
import {
  FlatList,
  Pressable,
  ScrollView,
  TextInput,
  TouchableOpacity,
  View,
  Text,
} from "react-native";

export default function Page() {
  const t = useTRPC();

  const { data, isLoading } = useQuery(t.product.listAllProduct.queryOptions());
  const { data: d2 } = useQuery(t.user.getUser.queryOptions());
  const [isOpen, setIsOpen] = useState(false);
  const [value, setValue] = useState("");
  const [query, setQuery] = useState("");

  const r = useRouter();
  useEffect(() => {
    if (d2) {
      if (d2.name == null || d2.location == null || d2.name == "") {
        r.replace("/(main)/user");
      }
    }
  }, [d2]);

  const { isLoading: sl, data: sd } = useQuery(
    t.product.getProductBySearch.queryOptions(
      {
        query: query,
      },
      {
        enabled: isOpen && query.length > 0,
      }
    )
  );

  const { data: cd, isLoading: cl } = useQuery(
    t.store.listCategories.queryOptions()
  );

  useEffect(() => {
    let timer: number | null = null;
    if (isOpen && value.length > 0) {
      timer = setTimeout(() => {
        setQuery(value);
      }, 500);
    }
    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [value, isOpen]);

  const { isLoading: ul, data: ud } = useQuery(t.user.getUser.queryOptions());
  const { isLoading: stl, data: std } = useQuery(
    t.store.getNearByStores.queryOptions(
      {
        lat: ud?.location.lat ?? 0,
        long: ud?.location.long ?? 0,
        limit: 2,
      },
      {
        enabled: ud && ud.location.lat !== 0,
      }
    )
  );
  return (
    <ScrollViewComponent className="p-6 ">
      <Loading isloading={isLoading || ul || stl || cl}>
        <View className="flex flex-col gap-6 pb-20">
          <View>
            <TouchableOpacity
              onPress={() => {
                setIsOpen(true);
              }}
              className="flex flex-row bg-white rounded-2xl border border-slate-200 justify-between p-4 items-center"
            >
              <TextComponent>Search</TextComponent>
              <Ionicons name="search" size={24} />
            </TouchableOpacity>
            <Modal
              visible={isOpen}
              withInput
              onRequestClose={() => setIsOpen(false)}
            >
              <View className="flex flex-col p-4 bg-white rounded-2xl border border-slate-200 w-full h-4/6 gap-4">
                <TextInput
                  className="bg-white rounded-2xl border border-slate-200 p-4 "
                  placeholder="Search Product"
                  placeholderTextColor={"black"}
                  value={value}
                  onChangeText={(text) => {
                    setValue(text);
                  }}
                />
                {sl ? (
                  <View className="flex flex-1 flex-row items-center justify-center">
                    <ActivityIndicator />
                  </View>
                ) : (
                  <View>
                    {sd?.length === 0 ? (
                      <View className="flex flex-row items-center  pt-6 justify-center">
                        <TextComponent>No Product Found</TextComponent>
                      </View>
                    ) : (
                      <>
                        {sd?.map((item) => {
                          return (
                            <Pressable
                              key={item.id}
                              onPress={() => {
                                r.push({
                                  pathname: "/productbyAvail/[id]",
                                  params: {
                                    id: item.id,
                                  },
                                });
                              }}
                              className=""
                            >
                              <TextComponent>{item.name}</TextComponent>
                            </Pressable>
                          );
                        })}
                      </>
                    )}
                  </View>
                )}
              </View>
            </Modal>
          </View>

          <View className="flex-1 flex flex-col gap-2 ">
            <QuickActionRow
              title="Near by Stores"
              title2="Check all "
              path="/store"
            />
            {std?.length === 0 ? (
              <View className="flex flex-row items-center  pt-6 justify-center">
                <TextComponent>No Stores Found</TextComponent>
              </View>
            ) : (
              <FlatList
                numColumns={2}
                // Removed style={{ width: '100%' }} - often not needed with flex parent
                data={std}
                // Added keyExtractor for performance and stability
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => {
                  return (
                    <Pressable
                      style={{ flex: 1 }} // Ensure Pressable takes up the column space
                      onPress={() =>
                        r.push({
                          pathname: "/store/[id]",
                          params: {
                            id: item.id,
                          },
                        })
                      }
                    >
                      <ProductCard
                        name={item.name}
                        src={item.img ? item.img : null}
                      />
                    </Pressable>
                  );
                }}
              />
            )}
          </View>
          <View className="flex-1 flex flex-col gap-2">
            <MainOverview
              title="Top Categories"
              description="Categories you might like"
            />
            {!cd || cd.length == 0 ? (
              <Text>No products</Text>
            ) : (
              <FlatList
                numColumns={2}
                // Removed style={{ width: '100%' }} - often not needed with flex parent
                data={cd}
                // Added keyExtractor for performance and stability
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => {
                  // Wrap ProductCard in Pressable for navigation
                  // Apply flex: 1 to Pressable to ensure it takes up column space
                  return (
                    <Pressable
                      style={{ flex: 1 }} // Ensure Pressable takes up the column space
                      onPress={() =>
                        r.push({
                          pathname: "/category/[id]",
                          params: {
                            id: item.id,
                          },
                        })
                      }
                    >
                      <ProductCard
                        name={item.name}
                        src={item.img ? item.img : null}
                      />
                    </Pressable>
                  );
                }}
                // Add contentContainerStyle for potential inner spacing if needed
                // contentContainerStyle={{ paddingBottom: 80 }} // Example if button overlaps
              />
            )}
          </View>
        </View>
      </Loading>
    </ScrollViewComponent>
  );
}
