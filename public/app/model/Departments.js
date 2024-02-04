Ext.define('PHNet.model.Departments',{
	extend: 'Ext.data.Model',
	fields: [{name: 'id', type: 'integer'}, 'name', 'manager', 'email', 'telephone', 'quality', 'shopping']
});