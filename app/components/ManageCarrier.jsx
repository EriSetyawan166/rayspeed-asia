import React from 'react';
import {
    Layout,
    Text,
    Card,
    Button,
    BlockStack,
    InlineStack,
    Thumbnail,
    InlineGrid
  } from "@shopify/polaris";

const ManageCarrier = ({ handleToggleRayspeed, isLoading, isRayspeedExist }) => {
    return (
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
    );
}

export default ManageCarrier;