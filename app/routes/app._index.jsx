import { useEffect, useState } from "react";
import { json } from "@remix-run/node";
import { useActionData, useNavigation, useSubmit, useLoaderData } from "@remix-run/react";
import {
  Page,
  Layout,
  Text,
  Card,
  Button,
  BlockStack,
  Box,
  List,
  Link,
  InlineStack,
  Thumbnail,
  InlineGrid
} from "@shopify/polaris";
import { authenticate } from "../shopify.server";


export const loader = async ({ request }) => {
  const { admin, session } = await authenticate.admin(request);
  const carrierService = await retrieveCarrierServices({ request });
  // const add = await addRayspeedCarrierService({ request });
  // const delete_rayspeed = await removeRayspeedCarrierService({ request });
  console.log(carrierService)
  return carrierService
};

export const retrieveCarrierServices = async ({ request }) => {
  const { admin, session } = await authenticate.admin(request);
  const response = await admin.rest.resources.CarrierService.all({
    session: session,
  });
  const rayspeedCarrierService = response.data.find(
    (service) => service.name === 'rayspeed'
  );
  // const responseJson = await response.json();
  return rayspeedCarrierService || null;
}

export const action = async ({ request }) => {
  const { admin, session } = await authenticate.admin(request);
  const response = await admin.rest.resources.CarrierService.all({
    session: session,
  });

  const rayspeedCarrierService = response.data.find(
    (service) => service.name === 'rayspeed'
  );

  if (rayspeedCarrierService) {
    // Apus Rayspeed jika sudah ada
    const deleteResponse = await admin.rest.resources.CarrierService.delete({
      session: session,
      id: rayspeedCarrierService.id,
    });

    return json({ message: 'Rayspeed Carrier Service deleted' });
  } else {
    // Tambah Rayspeed jika belum ada
    const carrier_service = new admin.rest.resources.CarrierService({
      session: session,
    });
    carrier_service.name = 'rayspeed';
    carrier_service.callback_url =
      'https://rayspeed.co.id/rayspeed_shopify_shipping_rates_development/pricing.php';
    carrier_service.service_discovery = true;
    await carrier_service.save({
      update: true,
    });

    return json({ message: 'Rayspeed Carrier Service added' });
  }
}



export default function Index() {
  const carrierServices = useLoaderData();
  const [isRayspeedExist, setIsRayspeedExist] = useState(
    carrierServices && carrierServices.data && carrierServices.data.some((service) => service.name === 'rayspeed')
  );
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    if (carrierServices) {
      setIsRayspeedExist(carrierServices.name === 'rayspeed');
    } else {
      setIsRayspeedExist(false)
    }
  }, [carrierServices]);

  const submit = useSubmit();

  const handleToggleRayspeed = async () => {
    setIsLoading(true);
    const response = await submit({}, { replace: true, method: 'POST' });
    console.log(response); // Logging the response for debugging
    setIsRayspeedExist(!isRayspeedExist);
    setIsLoading(false);
  };

  return (
    <Page>
      <BlockStack gap="500">
        <Layout>
          <Layout.Section>
            <Card>
              <InlineStack blockAlign="center" >
                <InlineGrid gap="400" columns={2} >
                  <InlineStack gap="400" blockAlign="center">
                    {/* Thumbnail Placeholder */}
                    <Thumbnail
                      source="https://placehold.it/50"
                      alt="Rayspeed Logo"
                      size="medium"
                      label="Center"
                    />
                    {/* Carrier Service Name */}
                    <Text as="h2" variant="headingMd" alignment="center">
                      Rayspeed
                    </Text>
                  </InlineStack>
                </InlineGrid>
                <BlockStack>
                  <InlineStack align="end">
                  <BlockStack>
                      <InlineStack align="end">
                        <div className="buttonContainer">
                          <Button
                            onClick={handleToggleRayspeed}
                            size="slim"
                            variant="primary"
                            tone={isRayspeedExist ? 'critical' : 'default'}
                            loading={isLoading}
                          >
                            {isRayspeedExist ? 'Delete Rayspeed' : 'Add Rayspeed'}
                          </Button>
                        </div>
                      </InlineStack>
                    </BlockStack>
                  </InlineStack>
                </BlockStack>
                
              </InlineStack>
            </Card>
          </Layout.Section>
          <Layout.Section variant="oneThird">
            <BlockStack gap="500">
              <Card>
                <BlockStack gap="200">
                  <Text as="h2" variant="headingMd">
                    App template specs
                  </Text>
                  <BlockStack gap="200">
                    <InlineStack align="space-between">
                      <Text as="span" variant="bodyMd">
                        Framework
                      </Text>
                      <Link
                        url="https://remix.run"
                        target="_blank"
                        removeUnderline
                      >
                        Remix
                      </Link>
                    </InlineStack>
                    <InlineStack align="space-between">
                      <Text as="span" variant="bodyMd">
                        Database
                      </Text>
                      <Link
                        url="https://www.prisma.io/"
                        target="_blank"
                        removeUnderline
                      >
                        Prisma
                      </Link>
                    </InlineStack>
                    <InlineStack align="space-between">
                      <Text as="span" variant="bodyMd">
                        Interface
                      </Text>
                      <span>
                        <Link
                          url="https://polaris.shopify.com"
                          target="_blank"
                          removeUnderline
                        >
                          Polaris
                        </Link>
                        {", "}
                        <Link
                          url="https://shopify.dev/docs/apps/tools/app-bridge"
                          target="_blank"
                          removeUnderline
                        >
                          App Bridge
                        </Link>
                      </span>
                    </InlineStack>
                    <InlineStack align="space-between">
                      <Text as="span" variant="bodyMd">
                        API
                      </Text>
                      <Link
                        url="https://shopify.dev/docs/api/admin-graphql"
                        target="_blank"
                        removeUnderline
                      >
                        GraphQL API
                      </Link>
                    </InlineStack>
                  </BlockStack>
                </BlockStack>
              </Card>
              <Card>
                <BlockStack gap="200">
                  <Text as="h2" variant="headingMd">
                    Next steps
                  </Text>
                  <List>
                    <List.Item>
                      Build an{" "}
                      <Link
                        url="https://shopify.dev/docs/apps/getting-started/build-app-example"
                        target="_blank"
                        removeUnderline
                      >
                        {" "}
                        example app
                      </Link>{" "}
                      to get started
                    </List.Item>
                    <List.Item>
                      Explore Shopify’s API with{" "}
                      <Link
                        url="https://shopify.dev/docs/apps/tools/graphiql-admin-api"
                        target="_blank"
                        removeUnderline
                      >
                        GraphiQL
                      </Link>
                    </List.Item>
                  </List>
                </BlockStack>
              </Card>
            </BlockStack>
          </Layout.Section>
        </Layout>
      </BlockStack>
    </Page>
  );
}
