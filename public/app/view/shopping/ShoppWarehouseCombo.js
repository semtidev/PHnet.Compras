Ext.define('PHNet.view.shopping.ShoppWarehouseCombo', {
    extend: 'Ext.form.field.ComboBox',
    alias : 'widget.shoppwarehousecombo',
    id: 'shoppwarehousecombo',
    store: Ext.create('PHNet.store.shopping.Goodswarehouse'),
    allowBlank: false,
    editable: false,
    displayField: 'address',
    valueField: 'id',
    value: 1
});	