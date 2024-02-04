Ext.define('PHNet.view.shopping.ShoppRequestForm', {
    extend: 'Ext.window.Window',
    id: 'shoppingrequestform',
    alias: 'widget.shoppingrequestform',
    requires: ['Ext.form.*'],
    title: '<i class="fas fa-shopping-cart fa-sm"></i>&nbsp;&nbsp;Nueva Solicitud de Compra',
    layout: 'fit',
    autoShow: true,
    resizable: false,
    animateTarget: 'shopp-btn-add',
    width: 550,
    height: 420,
    modal: true,
    initComponent: function() {

        // Let dates document
        let datedoc = new Date();
        datedoc.setDate(datedoc.getDate() + 7);
        let datestar = new Date(datedoc.getFullYear(), datedoc.getMonth(), datedoc.getDate());

        this.items = [{
            xtype: 'form',
            padding: '12 17 15 17',
            border: false,
            modal: true,
            style: 'background-color: #f2f8fc;',
            waitMsgTarget: true,
            fieldDefaults: {
                anchor: '100%',
                labelAlign: 'top',
                combineErrors: true,
                //msgTarget: 'side'
            },
            items: [{
                    xtype: 'textfield',
                    name: 'id_request',
                    hidden: true
                }, {
                    xtype: 'textfield',
                    name: 'id_parent',
                    id: 'requestform_parent',
                    hidden: true
                }, {
                    xtype: 'textfield',
                    name: 'updated_by',
                    id: 'requestform_updated_by',
                    hidden: true
                }, {
                    xtype: 'textfield',
                    id: 'shopprequestform_name',
                    allowBlank: false,
                    fieldLabel: 'Nombre de la Solicitud',
                    flex: 1,
                    margin: '0 5 10 5',
                    name: 'name',
                    emptyText: 'Describa la Solicitud de Compra',
                    afterLabelTextTpl: '<span style="color:red;font-weight:bold" data-qtip="Requerido"> *</span>',
                    /*listeners: {
                        afterrender: function(field) {
                          field.focus(false, 600);                          
                        },
                        specialkey: function(field, e){
                            // e.HOME, e.END, e.PAGE_UP, e.PAGE_DOWN,
                            // e.TAB, e.ESC, arrow keys: e.LEFT, e.RIGHT, e.UP, e.DOWN
                            if (e.getKey() == e.ENTER) {
                                Ext.getCmp('extpollform_department').focus();
                            }
                        }
                    }*/
                }, {
                    xtype: 'fieldcontainer',
                    combineErrors: true,
                    msgTarget: 'none', // qtip  title  under
                    margin: '0 2 5 2',
                    height: 63,
                    layout: 'hbox',
                    items: [
                        Ext.create('PHNet.view.shopping.ShoppWorksComboForm', {
                            id: 'shopprequestform_project',
                            allowBlank: false,
                            fieldLabel: 'Obra / Compra Agrupada',
                            emptyText: 'Seleccione del listado...',
                            flex: 1,
                            style: {
                                height: '30px'
                            },
                            margin: '0 7 5 3',
                            name: 'project',
                            afterLabelTextTpl: '<span style="color:red;font-weight:bold" data-qtip="Requerido"> *</span>',
                            listeners: {
                                beforerender: function(combo, e) {
                                    // Load Store
                                    let user = localStorage.getItem('phcp_ui');
                                    let proxy = combo.getStore().getProxy();
                                    Ext.apply(proxy.api, {
                                        read: '/phnet.compras/public/api/shopping/worksform/' + user
                                    });
                                    combo.getStore().load();
                                },
                                change: function(combo, newValue, oldValue, e) {
                                    let dptocombo = Ext.getCmp('shopprequestform_department'),
                                        user = localStorage.getItem('phcp_ui'),
                                        proxy = dptocombo.getStore().getProxy();
                                    // Compras Agrupadas
                                    if (newValue == 12) {
                                        Ext.apply(proxy.api, {
                                            read: '/phnet.compras/public/api/shopping/departmentsform/' + user + '/1'
                                        });
                                        dptocombo.getStore().load();
                                    } else {
                                        Ext.apply(proxy.api, {
                                            read: '/phnet.compras/public/api/shopping/departmentsform/' + user
                                        });
                                        dptocombo.getStore().load();
                                    }
                                }
                            }
                        }),
                        Ext.create('PHNet.view.shopping.ShoppDptosComboForm', {
                            id: 'shopprequestform_department',
                            allowBlank: false,
                            fieldLabel: 'Departamento(s) / Comunes',
                            emptyText: 'Seleccione del listado...',
                            flex: 1,
                            margin: '0 3 5 7',
                            name: 'department[]',
                            afterLabelTextTpl: '<span style="color:red;font-weight:bold" data-qtip="Requerido"> *</span>',
                            listeners: {
                                beforerender: function(combo, e) {
                                    // Load Store
                                    let user = localStorage.getItem('phcp_ui');
                                    let proxy = combo.getStore().getProxy();
                                    Ext.apply(proxy.api, {
                                        read: '/phnet.compras/public/api/shopping/departmentsform/' + user
                                    });
                                    combo.getStore().load();
                                }
                            }
                        })
                    ]
                }, {
                    xtype: 'fieldcontainer',
                    combineErrors: true,
                    msgTarget: 'none', // qtip  title  under
                    margin: '0 2 5 2',
                    height: 63,
                    layout: 'hbox',
                    items: [{
                            xtype: 'textfield',
                            id: 'shopprequestform_nomanagement',
                            allowBlank: false,
                            fieldLabel: 'C\xF3digo de Gesti\xF3n',
                            emptyText: 'Teclee el C\xF3digo de gesti\xF3n',
                            flex: 1,
                            minHeight: 35,
                            margin: '0 7 5 3',
                            name: 'management_code',
                            afterLabelTextTpl: '<span style="color:red;font-weight:bold" data-qtip="Requerido"> *</span>'
                        },
                        {
                            xtype: 'combo',
                            id: 'form_request_typeshop',
                            queryMode: 'local',
                            value: 'import',
                            forceSelection: true,
                            editable: false,
                            flex: 1,
                            margin: '0 7 5 3',
                            fieldLabel: 'Tipo de Compra',
                            name: 'typeshop',
                            displayField: 'name',
                            valueField: 'value',
                            store: Ext.create('Ext.data.Store', {
                                fields: ['name', 'value'],
                                data: [
                                    { name: 'Importaci\xF3n', value: 'import' },
                                    { name: 'Nacional', value: 'national' },
                                    { name: 'Local', value: 'local' }
                                ]
                            }),
                            afterLabelTextTpl: '<span style="color:red;font-weight:bold" data-qtip="Requerido"> *</span>',
                            value: 'import'
                        }
                        /*{
                            xtype: 'datefield',
                            id: 'form_request_date',
                            editable: true,
                            flex: 1,
                            allowBlank: false,
                            name: 'document_date',
                            emptyText: 'Elija la fecha del calendario',
                            fieldLabel: 'Fecha Presentaci\xF3n a UBI-PH',
                            format: 'd/m/Y',
                            submitFormat: 'Y-m-d',
                            margin: '0 3 5 7',
                            value: datestar,
                            minValue: new Date(),
                            afterLabelTextTpl: '<span style="color:red;font-weight:bold" data-qtip="Required"> *</span>'
                        }*/
                    ]
                },
                /*{
                                   xtype: 'fieldcontainer',
                                   combineErrors: true,
                                   msgTarget: 'none', // qtip  title  under
                                   margin: '0 2 5 2',
                                   height: 63,
                                   layout: 'hbox',
                                   items: [
                                       {
                                           xtype: 'combo',
                                           id: 'form_request_typeshop',
                                           queryMode: 'local',
                                           value: 'import',
                                           forceSelection: true,
                                           editable: false,
                                           flex: 1,
                                           margin: '0 7 5 3',
                                           fieldLabel: 'Tipo de Compra',
                                           name: 'typeshop',
                                           displayField: 'name',
                                           valueField: 'value',
                                           store: Ext.create('Ext.data.Store', {
                                               fields : ['name', 'value'],
                                               data   : [
                                                   {name : 'Importaci\xF3n', value: 'import'},
                                                   {name : 'Nacional',  value: 'national'},
                                                   {name : 'Local',  value: 'local'}
                                               ]
                                           }),
                                           afterLabelTextTpl: '<span style="color:red;font-weight:bold" data-qtip="Required"> *</span>',
                                           value: 'import'
                                       },
                                       {
                                           xtype: 'combo',
                                           id: 'form_request_quote',
                                           queryMode: 'local',
                                           value: 'project',
                                           forceSelection: true,
                                           editable: false,
                                           flex: 1,
                                           margin: '0 3 5 7',
                                           fieldLabel: 'Presupuesto',
                                           name: 'quote',
                                           displayField: 'name',
                                           valueField: 'value',
                                           store: Ext.create('Ext.data.Store', {
                                               fields : ['name', 'value'],
                                               data: [
                                                   {name : 'Ejecuci\xF3n de Obra', value: 'project'},
                                                   {name : 'Garant\xEDa',  value: 'warranty'}
                                               ]
                                           }),
                                           afterLabelTextTpl: '<span style="color:red;font-weight:bold" data-qtip="Required"> *</span>'
                                       }
                                   ]
                               },*/
                {
                    xtype: 'textareafield',
                    height: 80,
                    allowBlank: false,
                    name: 'comment',
                    fieldLabel: 'Comentario',
                    flex: 1,
                    margin: '0 5 5 5',
                    allowBlank: true
                }
            ]
        }];

        this.dockedItems = [{
            xtype: 'toolbar',
            dock: 'bottom',
            id: 'buttons',
            ui: 'footer',
            items: ['->', {
                id: 'shopprequestform-okbutton',
                text: '<i class="fas fa-check"></i>&nbsp;Aceptar',
                cls: 'app-form-btn',
                scale: 'medium',
                margin: '3 0 3 0',
                action: 'storeclose'
            }, {
                id: 'shopprequestform-cancelbtn',
                text: '<i class="fas fa-times"></i>&nbsp;Cancelar',
                cls: 'app-form-btn',
                scale: 'medium',
                margin: '3 15 3 5',
                scope: this,
                handler: this.close
            }]
        }];

        this.callParent(arguments);
    }
});