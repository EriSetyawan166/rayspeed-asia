import React from 'react';
import { Text, Link, InlineGrid } from "@shopify/polaris";

const Header = () => {
    return (
      <InlineGrid gap="400" columns={2}>
        <Text as="h1" variant="heading2xl" alignment="start">
          Rayspeed Asia
        </Text>
        <Text as="h3" variant="headingLg" alignment="end" fontWeight="regular">
          <Link url="https://rayspeed.com/" removeUnderline="true" monochrome="true" target="_blank">
            About us
          </Link>
        </Text>
      </InlineGrid>
    );
  };
  
  export default Header;