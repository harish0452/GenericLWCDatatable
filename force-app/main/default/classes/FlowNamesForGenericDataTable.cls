global class FlowNamesForGenericDataTable extends VisualEditor.DynamicPickList{
    
    global override VisualEditor.DataRow getDefaultValue(){
        VisualEditor.DataRow defaultValue = new VisualEditor.DataRow('None', 'None');
        return defaultValue;
    }
    global override VisualEditor.DynamicPickListRows getValues() {
        List<FlowdefinitionView> FDList=[SELECT Id,ApiName, Label FROM FlowDefinitionView];
        
        VisualEditor.DynamicPickListRows  myValues = new VisualEditor.DynamicPickListRows();
        For(FlowdefinitionView F : FDList){
            VisualEditor.DataRow value = new VisualEditor.DataRow(F.ApiName,F.ApiName);
            myValues.addRow(value);
            
        }
            return myValues;
         }
}
