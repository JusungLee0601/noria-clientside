pub use crate::types::ChangeType as ChangeType
pub use crate::units::Row as Row

//Change, typing shows ChangeType, batch holds multiple potential changes
#[derive(Debug, Clone, PartialEq)]
pub struct Change {
    typing: ChangeType,
    batch: Vec<Row>
}

//Change functions
impl Change {
    //constructor
    pub fn new(typing: ChangeType, batch: Vec<Row>) -> Change {
        Change { typing, batch }
    }
}
