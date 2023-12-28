import { useEffect, useState } from "react";
import { useSubmit, useLoaderData } from "@remix-run/react";
import {
  Page,
  Layout,
  BlockStack,
} from "@shopify/polaris";
import Header from '../components/Header'
import ManageCarrier from "../components/ManageCarrier";
import { retrieveCarrierServices, actionToggle } from "../api/carrierService";

export const loader = async ({ request }) => {
  return retrieveCarrierServices({ request });
};

export const action = async ({ request }) => {
  return actionToggle({ request })
}

const checkRayspeedExistence = (carrierServices) => {
  return carrierServices && carrierServices.name === 'rayspeed';
};

export default function Index() {
  const carrierServices = useLoaderData();
  const [isRayspeedExist, setIsRayspeedExist] = useState(checkRayspeedExistence(carrierServices));
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    if (checkRayspeedExistence(carrierServices)) {
      setIsRayspeedExist(true);
    } else {
      setIsRayspeedExist(false)
    }
  }, [carrierServices]);

  const submit = useSubmit();

  const handleToggleRayspeed = async () => {
    setIsLoading(true);
    await submit({}, { replace: true, method: 'POST' });
    setIsRayspeedExist(!isRayspeedExist);
    setIsLoading(false);
  };

  return (
    <Page>
      <BlockStack gap="500">
        <Layout>
          <Layout.Section>
            <Header />
          </Layout.Section>
        </Layout>
        <ManageCarrier
          handleToggleRayspeed={handleToggleRayspeed}
          isRayspeedExist={isRayspeedExist}
          isLoading={isLoading}
        />
      </BlockStack>
    </Page>
  );
}
