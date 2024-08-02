
export type TRajaOngkirCostResponse = {
    rajaongkir: {
      query: {
        origin: string;
        destination: string;
        weight: number;
        courier: string;
      };
      status: {
        code: number;
        description: string;
      };
      origin_details: {
        city_id: string;
        province_id: string;
        province: string;
        type: string;
        city_name: string;
        postal_code: string;
      };
      destination_details: {
        city_id: string;
        province_id: string;
        province: string;
        type: string;
        city_name: string;
        postal_code: string;
      };
      results: Array<{
        code: string;
        name: string;
        costs: Array<{
          service: string;
          description: string;
          cost: Array<{
            value: number;
            etd: string;
            note: string;
          }>;
        }>;
      }>;
    };
  };
  