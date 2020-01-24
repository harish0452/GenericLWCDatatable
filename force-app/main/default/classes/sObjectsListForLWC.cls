global class sObjectsListForLWC extends VisualEditor.DynamicPickList {
    
    global override VisualEditor.DataRow getDefaultValue(){
        VisualEditor.DataRow defaultValue = new VisualEditor.DataRow('Account', 'Account');
        return defaultValue;
    }
    global override VisualEditor.DynamicPickListRows getValues() {

        Map<String, Schema.SObjectType> schemaMap = Schema.getGlobalDescribe();
        
        VisualEditor.DynamicPickListRows  myValues = new VisualEditor.DynamicPickListRows();

        for(String key : schemaMap.keySet()){
            system.debug('Object names----->>>>>>>' + schemaMap.get(key).getDescribe().getName());
            VisualEditor.DataRow value = new VisualEditor.DataRow(schemaMap.get(key).getDescribe().getName(),schemaMap.get(key).getDescribe().getName());
            myValues.addRow(value);
        }

        return myValues;
         }


}
