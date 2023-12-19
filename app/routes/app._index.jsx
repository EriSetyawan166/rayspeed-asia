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
            <InlineGrid gap="400" columns={2}>
              <Text as="h1" variant="heading2xl" alignment="start">
                            Rayspeed Asia
              </Text>
              <Text as="h3" variant="headingLg" alignment="end" fontWeight="regular">
        <Link url="https://rayspeed.com/" removeUnderline="true" monochrome="true" target="_blank">About us</Link>
      </Text>
            </InlineGrid>
          </Layout.Section>
        </Layout>
        <Layout>
          <Layout.Section variant="oneThird">
            <BlockStack gap="500">
                <BlockStack gap="200">
                  <Text as="h2" variant="headingMd">
                    Kelola Rayspeed
                  </Text>
                  <BlockStack gap="200">
                    <InlineStack align="space-between">
                      <Text as="span" variant="bodyMd">
                        Aktifkan dan kelola rayspeed untuk checkout di toko Anda
                      </Text>
                    </InlineStack>
                  </BlockStack>
                </BlockStack>
            </BlockStack>
          </Layout.Section>
          <Layout.Section>
            <Card>
              <InlineStack blockAlign="center" >
                <InlineGrid gap="400" columns={2} >
                  <InlineStack gap="400" blockAlign="center">
                    {/* Thumbnail Placeholder */}
                    <Thumbnail
                      source="/images/rayspeed_logo.png"
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
        </Layout>
      </BlockStack>
    </Page>
  );
}
