Ext.define('PHNet.view.shopping.ShoppDptosComboForm', {
    extend: 'Ext.form.field.ComboBox',
    alias : 'widget.shoppdptoscomboform',
    id: 'shoppdptoscomboform',
    store: Ext.create('PHNet.store.shopping.Departmentscomboform'),
    allowBlank: true,
    editable: true,
    width: 170,
    margin: '2 0 2 5',
    fieldLabel: '<i class="fas fa-home icon_darkblue"></i>',
    labelWidth: 30,
    labelAlign: 'right',
    displayField: 'name',
    valueField: 'id',
	multiSelect: true,
	queryMode: 'local'
});	