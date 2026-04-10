import { getMetadataArgsStorage } from 'routing-controllers';
import { routingControllersToSpec } from 'routing-controllers-openapi';
import { controllers } from '../controllers';
import { validationMetadatasToSchemas } from 'class-validator-jsonschema';

/**
 * @description Retrieves the Swagger specification for the API.
 * @returns The Swagger specification object.
 */
export function getSwaggerSpec() {
    let cachedSpec: any;
    if (!cachedSpec) {
        const storage = getMetadataArgsStorage();
        const schemas = validationMetadatasToSchemas({
            refPointerPrefix: '#/components/schemas/',
        });

        cachedSpec = routingControllersToSpec(
            storage,
            {
                controllers,
            },
            {
                info: {
                    title: 'SOC API',
                    version: '1.0.0',
                },
                components: {
                    schemas,
                },
            },
        );
    }
    return cachedSpec;
}
