Ext.define('PHNet.view.shopping.ShoppDptosCombo', {
    extend: 'Ext.form.field.ComboBox',
    alias: 'widget.shoppdptoscombo',
    id: 'shoppdptoscombo',
    store: Ext.create('PHNet.store.shopping.Departmentscombo'),
    allowBlank: true,
    editable: false,
    width: 200,
    margin: '2 0 2 5',
    fieldLabel: '<i class="fas fa-home icon_darkblue"></i>',
    labelWidth: 30,
    labelAlign: 'right',
    displayField: 'name',
    valueField: 'id',
    value: -1
});