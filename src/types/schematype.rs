use wasm_bindgen::JsValue;
use wasm_bindgen::prelude::*;

//Schema, for Views only
#[wasm_bindgen]
#[derive(Debug, Clone, PartialEq)]
#[derive(Serialize, Deserialize)]
pub enum SchemaType {
    None,
    Int,
    Text
}

//from conversion, JsValue->SchemaType
impl From<JsValue> for SchemaType {
    fn from(item: JsValue) -> Self {
        if item == 2 {
            SchemaType::Text
        } else if item == 1 {
            SchemaType::Int
        } else {
            SchemaType::None
        }
    }
}