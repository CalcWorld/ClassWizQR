import modelCY from './CY.json' assert { type: 'json' };
import modelEY from './EY.json' assert { type: 'json' };

export const getModelInfo = (model, type) => {
  return (type === 'CY' ? modelCY[model] : modelEY[model]) || [undefined, undefined];
}
