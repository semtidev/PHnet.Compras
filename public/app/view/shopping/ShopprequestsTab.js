Ext.define('PHNet.view.shopping.ShopprequestsTab', {
    extend: 'Ext.tab.Panel',
    alias: 'widget.shopprequeststab',
    id: 'shopprequeststab',
    frame: false,
    layout: 'fit',
    requires: [
        'Ext.tab.*',
        'Ext.tip.QuickTipManager'
    ],
    activeTab: 0,
    listeners: {
        beforerender: function(view, opts) {
            let access = 'public';
            Ext.getCmp('requestswindow').getEl().mask('Cargando...', 'window-mask');

            if (localStorage.getItem('phcp_a')) {
                // Activate/Desactivate Functions Buttons
                let token = localStorage.getItem('phcp_a');
                Ext.Ajax.request({
                    url: '/phnet.compras/public/api/descrypter',
                    method: 'POST',
                    params: {
                        token: token
                    },
                    success: function(result, request) {
                        let jsonData = Ext.JSON.decode(result.responseText);
                        if (jsonData.failure) {
                            Ext.MessageBox.show({
                                title: 'Mensaje del Sistema',
                                msg: 'Ha ocurrido un error al cargar los permisos a esta ventana. Presione la tecla F5 de su teclado para que todo inicie nuevamente. Si el problema persiste póngase en contacto con el <a href="mailto:semti@nauta.cu">Administrador del Sistema</a>.',
                                buttons: Ext.MessageBox.OK,
                                icon: 'fas fa-exclamation-triangle fa-2x dlg-error'
                            });
                        } else {
                            let user_access = jsonData.access,
                                user_array = user_access.split('*');
                            user_works = user_array[0].split(',');
                            user_roles = user_array[1].split(',');
                            if (user_roles.includes('Jefe de Departamento') || user_roles.includes('Especialista de Obra') || user_roles.includes('Especialista de Compras')) {
                                Ext.getCmp('shopp-btn-add').setVisible(true);
                            }
                            Ext.getCmp('requestswindow').getEl().unmask();
                        }
                    },
                    failure: function() {
                        Ext.MessageBox.show({
                            title: 'Mensaje del Sistema',
                            msg: 'Ha ocurrido un error al cargar los permisos a esta ventana. Presione la tecla F5 de su teclado para que todo inicie nuevamente. Si el problema persiste póngase en contacto con el <a href="mailto:semti@nauta.cu">Administrador del Sistema</a>.',
                            buttons: Ext.MessageBox.OK,
                            icon: 'fas fa-exclamation-triangle fa-2x dlg-error'
                        });
                    }
                });
            } else {
                this.down('#shopp-btn-add').setVisible(false);
                this.down('#shopp-btn-upd').setVisible(false);
                this.down('#shopp-btn-del').setVisible(false);
                this.down('#shopp-btn-exp').setVisible(false);
                Ext.getCmp('requestswindow').getEl().unmask();
            }
        }
    },
    items: [{
        title: 'Modelos 711',
        xtype: 'requestsgrid',
        id: 'shopp711tab',
        itemId: 'shopp711tab',
        bodyPadding: 0
    }],
    initComponent: function() {

        let worksCombo = Ext.create('PHNet.view.shopping.ShoppWorksCombo'),
            dptosCombo = Ext.create('PHNet.view.shopping.ShoppDptosCombo', {
                margin: '2 10 2 3'
            }),
            me = this;

        me.dockedItems = [{
            xtype: 'toolbar',
            id: 'shopp711toolbar',
            cls: 'toolbar',
            height: 50,
            items: [{
                    iconCls: 'fas fa-plus icon-green',
                    id: 'shopp-btn-add',
                    cls: 'toolbar_button',
                    xtype: 'button',
                    text: '',
                    hidden: true,
                    margin: '2 5 2 3',
                    tooltip: 'Nueva Solicitud',
                    action: 'add'
                }, {
                    iconCls: 'fas fa-minus-circle icon-red2',
                    id: 'shopp-btn-del',
                    cls: 'toolbar_button',
                    text: '',
                    hidden: true,
                    margin: '2 5 2 2',
                    tooltip: 'Eliminar Solicitud Seleccionada',
                    action: 'del'
                }, {
                    iconCls: 'fas fa-edit icon-blue',
                    id: 'shopp-btn-upd',
                    cls: 'toolbar_button',
                    xtype: 'button',
                    text: '',
                    hidden: true,
                    margin: '2 5 2 3',
                    tooltip: 'Modificar Solicitud',
                    action: 'upd'
                }, {
                    iconCls: 'fas fa-file-pdf icon-red2',
                    id: 'shopp-btn-exp',
                    margin: '2 5 2 3',
                    cls: 'toolbar_button',
                    text: '',
                    disabled: true,
                    tooltip: 'Generar Modelos PDF',
                    menu: {
                        lid: 'shoppRequestExportMenu',
                        items: [
                            { text: 'Modelo 711', id: 'shoppExpModel711', itemId: 'shoppExpModel711', lid: 'shoppExpModel711', iconCls: 'fas fa-file-pdf icon-list', height: 28 },
                            { text: 'Listado de Productos', id: 'shoppExpModelProducts', itemId: 'shoppExpModelProducts', lid: 'shoppExpModelProducts', iconCls: 'fas fa-file-pdf icon-list', height: 28 },
                            { text: 'Cronograma de Suministros', id: 'shoppExpModelChronogram', itemId: 'shoppExpModelChronogram', lid: 'shoppExpModelChronogram', iconCls: 'fas fa-file-pdf icon-list', height: 28 },
                        ]
                    }
                }, {
                    id: 'request-filterbtn',
                    iconCls: 'fas fa-filter icon-blue',
                    cls: 'toolbar_button',
                    margin: '2 5 2 3',
                    text: '',
                    tooltip: 'Filtrar...',
                    menu: {
                        id: 'reqfiltermenu',
                        lid: 'requestFilterMenu',
                        width: 190,
                        items: [{
                                xtype: 'textfield',
                                id: 'search_request_field',
                                emptyText: 'Filtrar C\xF3digo/Descripci\xF3n',
                                flex: 1,
                                name: 'search_request_field',
                                margin: 7,
                                style: {
                                    height: '25px'
                                },
                                listeners: {
                                    specialkey: function(field, e) {
                                        if (e.getKey() == e.ENTER) {
                                            let search = field.getValue();
                                            me.fireEvent('search', search);
                                        }
                                    }
                                }
                            }, {
                                text: 'Circuito de Firmas',
                                id: 'filter-request-circuit',
                                itemId: 'filter-request-circuit',
                                lid: 'filter-request-circuit',
                                iconCls: 'fas fa-fingerprint icon-list',
                                menu: {
                                    id: 'filter-request-circuit-menu',
                                    items: [{
                                        xtype: 'radiofield',
                                        id: 'filter-circuit-all',
                                        checked: true,
                                        boxLabel: 'Todas',
                                        name: 'filter_menu_circuit_radio'
                                    }, {
                                        xtype: 'radiofield',
                                        id: 'filter-circuit-pending',
                                        boxLabel: 'Pendientes',
                                        name: 'filter_menu_circuit_radio'
                                    }, {
                                        xtype: 'radiofield',
                                        id: 'filter-circuit-approved',
                                        boxLabel: 'Aprobadas',
                                        name: 'filter_menu_circuit_radio'
                                    }, {
                                        xtype: 'radiofield',
                                        id: 'filter-circuit-rejected',
                                        boxLabel: 'Rechazadas',
                                        name: 'filter_menu_circuit_radio'
                                    }]
                                }
                            },
                            { text: 'Filtros Avanzados...', itemId: 'requestFilter', lid: 'requestFilter', iconCls: 'fas fa-arrow-right icon-list', height: 28 },
                            { text: 'Borrar Filtros', hidden: true, id: 'rq-menu-filter-remove', itemId: 'requestNoFilter', lid: 'requestNoFilter', iconCls: 'fas fa-times remove', height: 28 }
                        ]
                    }
                }, {
                    xtype: 'box',
                    hidden: true,
                    id: 'box-shopping-filter',
                    margin: '0 10 0 10',
                    cls: 'filter-info',
                    html: '<span class="badge badge-btn-filter"><i class="fas fa-check fa-sm"></i></span>'
                }, (localStorage.getItem('phcp_a') ? '-' : ''), {
                    id: 'shopp-btn-confirm',
                    cls: 'toolbar_button_accept',
                    xtype: 'button',
                    text: '<i class="fas fa-check"></i>&nbsp;&nbsp;Confirmar',
                    hidden: true,
                    margin: '2 5 2 3',
                    tooltip: 'Confirmar Solicitud de Compra Seleccionada',
                    action: 'request_confirm'
                }, {
                    xtype: 'box',
                    hidden: true,
                    id: 'shopp-info-confirm',
                    margin: '2 10 2 3',
                    cls: 'filter-info',
                    html: '<span class="shopp-confirm-info"><i class="fas fa-check"></i> Solicitud Confirmada</span>'
                }, {
                    id: 'shopp-btn-approve',
                    cls: 'toolbar_button_accept',
                    xtype: 'button',
                    text: '<i class="fas fa-check"></i>&nbsp;&nbsp;Aprobar',
                    hidden: true,
                    margin: '2 5 2 3',
                    tooltip: 'Aprobar Solicitud de Compra Seleccionada',
                    action: 'request_approve'
                }, {
                    xtype: 'box',
                    hidden: true,
                    id: 'shopp-info-approve',
                    margin: '2 10 2 3',
                    cls: 'filter-info',
                    html: '<span class="shopp-confirm-info"><i class="fas fa-check"></i> Solicitud Aprobada</span>'
                }, {
                    id: 'shopp-btn-reject',
                    cls: 'toolbar_button_reject',
                    xtype: 'button',
                    text: '<i class="fas fa-times"></i>&nbsp;&nbsp;Rechazar',
                    hidden: true,
                    margin: '2 0 2 3',
                    tooltip: 'Rechazar Solicitud de Compra Seleccionada',
                    action: 'request_reject'
                }, {
                    xtype: 'box',
                    hidden: true,
                    id: 'shopp-info-reject',
                    margin: '2 0 2 3',
                    cls: 'filter-info',
                    html: '<span class="shopp-reject-info"><i class="fas fa-times"></i> Solicitud Rechazada</span>'
                }, '->', worksCombo, dptosCombo
                /*,
                            Ext.create('PHNet.view.app.Monthcombo', {
                                id: 'shopp711monthcombo',
                                value: localStorage.getItem('phcp_m')
                            }),
                            Ext.create('PHNet.view.app.Yearcombo', {
                                id: 'shopp711yearcombo',
                                value: localStorage.getItem('phcp_y')
                            })*/
            ]
        }];

        this.callParent(arguments);
    }
});