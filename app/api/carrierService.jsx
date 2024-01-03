import { authenticate } from "../shopify.server";
import { json } from "@remix-run/node";

export const retrieveCarrierServices = async ({ request }) => {
    const { admin, session } = await authenticate.admin(request);
    const response = await admin.rest.resources.CarrierService.all({
      session: session,
    });
    const rayspeedCarrierService = response.data.find(
      (service) => service.name === 'rayspeed'
    );
    return rayspeedCarrierService || null;
}
  
export const actionToggle = async ({ request }) => {
    const { admin, session } = await authenticate.admin(request);
    const response = await admin.rest.resources.CarrierService.all({
      session: session,
    });
    
    

    const rayspeedCarrierService = response.data.find(
      (service) => service.name === 'rayspeed'
    );
  
    if (rayspeedCarrierService) {
      const deleteResponse = await admin.rest.resources.CarrierService.delete({
        session: session,
        id: rayspeedCarrierService.id,
      });
  
      return json({ message: 'Rayspeed Carrier Service deleted' });
    } else {
      const carrier_service = new admin.rest.resources.CarrierService({
        session: session,
      });
      carrier_service.name = 'rayspeed';
      carrier_service.callback_url =
        'https://rayspeed.com/speedship/api/shopify/pricing.php';
      carrier_service.service_discovery = true;
      await carrier_service.save({
        update: true,
      });
  
      return json({ message: 'Rayspeed Carrier Service added' });
    }
  }