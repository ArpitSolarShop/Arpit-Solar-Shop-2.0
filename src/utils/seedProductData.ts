import { supabase } from "@/integrations/supabase/client";
import { gridTieSystemData as shaktiGridTieData, COMPANY_NAME as SHAKTI_COMPANY_NAME, PRODUCT_DESCRIPTION as SHAKTI_PRODUCT_DESCRIPTION, WORK_SCOPE as SHAKTI_WORK_SCOPE } from "@/assets/shakti-solar-data";
import { gridTieSystemData as relianceGridTieData, largeSystemData, COMPANY_NAME as RELIANCE_COMPANY_NAME, PRODUCT_DESCRIPTION as RELIANCE_PRODUCT_DESCRIPTION, WORK_SCOPE as RELIANCE_WORK_SCOPE } from "@/assets/reliance-solar-data";
// import { shaktiResidentialData, relianceResidentialData, RELIANCE_COMPANY_NAME as RELIANCE_RES_COMPANY_NAME } from "@/pages/residential-data";
// import { relianceCommercialData, RELIANCE_COMPANY_NAME as RELIANCE_COMM_COMPANY_NAME } from "@/pages/commercial-data";

export const seedProductData = async () => {
  try {
    console.log('Starting data migration...');

    // Prepare products with proper typing
    const products = [
      {
        name: "Shakti Solar Grid-Tie System",
        description: SHAKTI_PRODUCT_DESCRIPTION,
        category: "Solar Systems",
        brand: "Sakti" as const,
        product_type: "Grid-Tie System",
        is_published: true,
        sort_order: 1,
        system_configurations: JSON.parse(JSON.stringify(shaktiGridTieData)),
        company_info: JSON.parse(JSON.stringify({
          company_name: SHAKTI_COMPANY_NAME,
          work_scope: SHAKTI_WORK_SCOPE,
          system_size_limit: 10
        })),
        specifications: JSON.parse(JSON.stringify({
          module_type: "DCR RIL 535 Wp Modules",
          inverter_type: "String Inverter",
          mounting: "Elevated Structure"
        }))
      },
      {
        name: "Reliance Solar Grid-Tie System",
        description: RELIANCE_PRODUCT_DESCRIPTION,
        category: "Solar Systems",
        brand: "Reliance" as const,
        product_type: "Grid-Tie System",
        is_published: true,
        sort_order: 2,
        system_configurations: JSON.parse(JSON.stringify(relianceGridTieData)),
        company_info: JSON.parse(JSON.stringify({
          company_name: RELIANCE_COMPANY_NAME,
          work_scope: RELIANCE_WORK_SCOPE,
          residential_limit: 13.8,
          commercial_limit: 165.6
        })),
        specifications: JSON.parse(JSON.stringify({
          module_type: "RIL 690-720 Wp HJT Solar Modules",
          inverter_type: "String Inverter",
          mounting: "HDG Elevated Structure"
        }))
      },
      {
        name: "Reliance Commercial Solar Systems",
        description: "Large scale commercial solar systems with multiple mounting options",
        category: "Solar Systems",
        brand: "Reliance" as const,
        product_type: "Commercial System",
        is_published: true,
        sort_order: 3,
        system_configurations: JSON.parse(JSON.stringify(largeSystemData)),
        company_info: JSON.parse(JSON.stringify({
          company_name: RELIANCE_COMPANY_NAME,
          work_scope: RELIANCE_WORK_SCOPE
        })),
        specifications: JSON.parse(JSON.stringify({
          module_type: "RIL 690-720 Wp HJT Solar Modules",
          inverter_type: "String Inverter",
          mounting_options: ["Short Rail Tin Shed", "HDG Elevated RCC", "Pre-GI MMS", "Without MMS"]
        }))
      },
      // {
      //   name: "Shakti Solar Residential Systems",
      //   description: "Complete residential solar solutions with competitive pricing",
      //   category: "Solar Systems",
      //   brand: "Sakti" as const,
      //   product_type: "Residential System",
      //   is_published: true,
      //   sort_order: 4,
      //   system_configurations: JSON.parse(JSON.stringify(shaktiResidentialData)),
      //   pricing_data: JSON.parse(JSON.stringify({
      //     price_includes: ["Installation", "Commissioning", "1 Year Warranty"],
      //     price_excludes: ["Civil Material", "Electrical Connection Charges"]
      //   })),
      //   company_info: JSON.parse(JSON.stringify({
      //     company_name: SHAKTI_COMPANY_NAME,
      //     system_size_limit: 13.8
      //   }))
      // },
      // {
      //   name: "Reliance Residential Solar Systems",
      //   description: "Premium residential solar solutions with advanced HJT technology",
      //   category: "Solar Systems",
      //   brand: "Reliance" as const,
      //   product_type: "Residential System",
      //   is_published: true,
      //   sort_order: 5,
      //   system_configurations: JSON.parse(JSON.stringify(relianceResidentialData)),
      //   pricing_data: JSON.parse(JSON.stringify({
      //     price_includes: ["Complete System Package", "Installation", "Commissioning"],
      //     warranty: "25 Year Performance Warranty"
      //   })),
      //   company_info: JSON.parse(JSON.stringify({
      //     company_name: RELIANCE_RES_COMPANY_NAME,
      //     system_size_limit: 13.8
      //   }))
      // },
      // {
      //   name: "Reliance Commercial Solar Solutions",
      //   description: "Scalable commercial solar solutions for businesses",
      //   category: "Solar Systems",
      //   brand: "Reliance" as const,
      //   product_type: "Commercial System",
      //   is_published: true,
      //   sort_order: 6,
      //   system_configurations: JSON.parse(JSON.stringify(relianceCommercialData)),
      //   company_info: JSON.parse(JSON.stringify({
      //     company_name: RELIANCE_COMM_COMPANY_NAME,
      //     system_size_limit: 1000
      //   }))
      // }
    ];

    // Insert products
    const { data, error } = await supabase
      .from('products')
      .insert(products);

    if (error) {
      console.error('Error inserting products:', error);
      throw error;
    }

    console.log('Successfully migrated product data:', data);
    return { success: true, count: products.length };

  } catch (error) {
    console.error('Error in data migration:', error);
    throw error;
  }
};