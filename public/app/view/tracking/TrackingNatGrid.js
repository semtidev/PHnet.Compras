// Location UX
Ext.Loader.setPath('Ext.ux', 'extjs42/includes/ux/');
let trackingnat_treestore = Ext.create('PHNet.store.shopping.Trackingnat', {
    storeId: 'trackingnattreestore'
});
Ext.define('PHNet.view.tracking.TrackingNatGrid', {
    extend: 'Ext.tree.Panel',
    alias: 'widget.trackingnatgrid',
    id: 'trackingnatgrid',
    requires: [
        'Ext.data.*',
        'Ext.grid.*',
        'Ext.tree.*',
        'Ext.util.*',
        'Ext.state.*'
    ],
    store: trackingnat_treestore,
    autoShow: true,
    frame: false,
    layout: 'fit',
    useArrows: true,
    rootVisible: false,
    multiSelect: false,
    listeners: {
        'afterrender': function(grid, opt) {

            if (localStorage.getItem('tracking_filter')) {
                Ext.getCmp('box-tracking-filter').setVisible(true);
                Ext.getCmp('menu-filter-remove').setVisible(true);
            }

            if (localStorage.getItem('phcp_a')) {
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

                            if (user_roles.includes('Jefe de Compras') || user_roles.includes('Especialista de Compras')) {
                                Ext.getCmp('track-filter-canceled').setVisible(true);
                            }
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
            }
        }
    },
    autoScroll: true,
    viewConfig: {
        columnLines: true,
        stripeRows: true
    },
    initComponent: function() {

        let me = this,
            cellEditingPlugin = Ext.create('Ext.grid.plugin.CellEditing', {
                pluginId: 'trackingnatgridEditing',
                clicksToEdit: 2
            });

        me.plugins = [cellEditingPlugin];
        me.columns = {
            defaults: {
                draggable: false,
                resizable: false,
                hideable: false,
                sortable: false
            },
            items: [{
                xtype: 'rownumberer',
                header: 'No',
                width: 40,
                align: 'center',
                locked: true,
                menuDisabled: true,
                sortable: false
            }, {
                header: 'Obra',
                dataIndex: 'work_abbr',
                width: 75,
                align: 'center',
                locked: true,
                menuDisabled: true,
                sortable: true,
                renderer: function(val, metaData, record, colIndex, store) {
                    metaData['tdAttr'] = 'data-qtip="' + record.get('work_name') + '"';
                    return val;
                }
            }, {
                xtype: 'treecolumn',
                id: 'trackingnat_treecolumn',
                text: 'No. 711 UBPH',
                cls: '',
                dataIndex: 'code',
                width: 150,
                align: 'left',
                locked: true,
                menuDisabled: true,
                sortable: false,
                renderer: function(val, metaData, record, colIndex, store) {
                    let totalcomments = record.get('totalcomments'),
                        badge = '',
                        badge_tip = '';
                    if (totalcomments > 0) {
                        badge = '<span class="badge info"><i class="fas fa-comments fa-sm"></i></span>';
                        badge_tip = ' | ' + totalcomments + ' Comentarios';
                    }
                    if (record.get('parent') != null && record.get('parent') != '') {
                        metaData['tdAttr'] = 'data-qtip="Distribuci\xF3n de Productos"';
                        return val;
                    } else {

                        let text_color = '',
                            status = '',
                            left = '';

                        if (record.get('approved') == 'rejected') {
                            text_color = 'text-red';
                            status = 'Solicitud Rechazada';
                        } else if (record.get('approved') == 'pending') {
                            text_color = 'text-gray';
                            status = 'Solicitud Pendiente de Aprobaci\xF3n'
                        } else {
                            text_color = 'text-green';
                            status = 'Solicitud Aprobada'
                        }

                        metaData['tdAttr'] = 'data-qtip="' + status + badge_tip + '"';
                        return '<span class="' + text_color + '">' + val + badge + '</span> ';
                    }
                }
            }, {
                header: 'Estado Actual',
                dataIndex: 'state',
                width: 120,
                locked: true,
                align: 'center',
                menuDisabled: true,
                sortable: false,
                emptyCellText: ''
            }, {
                header: 'PDF',
                width: 50,
                align: 'center',
                menuDisabled: true,
                sortable: false,
                renderer: function(val, metaData, record, colIndex, store) {
                    let doc = record.get('document');
                    if (doc != '' && doc != null) {
                        metaData['tdAttr'] = 'data-qtip="Clic para Ver Documentaci\xF3n Escaneada PDF"';
                        metaData.tdCls = 'row-icon';
                        return '<a href="/phnet.compras/storage/app/public/documents/' + doc + '" target="_black"><i class="fas fa-file-pdf icon-red"></i></a>';
                    } else {
                        metaData['tdAttr'] = 'data-qtip="No ha sido Agregada la Documentaci\xF3n Escaneada PDF"';
                        metaData.tdCls = 'row-icon';
                        return '<i class="fas fa-file-pdf icon-gray"></i>';
                    }
                }
            }, {
                header: 'Departamento(s)',
                dataIndex: 'department',
                width: 150,
                align: 'left',
                menuDisabled: true,
                sortable: true,
                renderer: function(val, metaData, record, colIndex, store) {
                    metaData['tdAttr'] = 'data-qtip="' + val + '"';
                    return val;
                }
            }, {
                header: 'Descripci\xF3n',
                dataIndex: 'name',
                flex: 1,
                minWidth: 250,
                menuDisabled: true,
                sortable: true,
                emptyCellText: '',
                renderer: function(val, metaData, record, colIndex, store) {
                    metaData['tdAttr'] = 'data-qtip="' + val + '"';
                    return val;
                }
            }, {
                header: 'Fecha',
                dataIndex: 'document_date',
                width: 90,
                align: 'center',
                menuDisabled: true,
                sortable: true,
                emptyCellText: ''
            }, {
                header: 'No. 711 ALMEST',
                dataIndex: 'code_almest',
                width: 100,
                align: 'center',
                menuDisabled: true,
                sortable: false,
                emptyCellText: '',
                editor: {
                    xtype: 'textfield',
                    maxLength: 20,
                    selectOnFocus: true
                }
            }, {
                header: 'Presupuesto',
                dataIndex: 'budget',
                width: 100,
                align: 'right',
                menuDisabled: true,
                sortable: false,
                emptyCellText: ''
            }, {
                header: 'No. Contrato',
                dataIndex: 'contract_code',
                width: 100,
                align: 'center',
                menuDisabled: true,
                sortable: false,
                emptyCellText: '',
                editor: {
                    xtype: 'textfield',
                    maxLength: 20,
                    selectOnFocus: true
                }
            }, {
                header: 'Valor Contrato',
                dataIndex: 'contract_value',
                width: 100,
                align: 'right',
                menuDisabled: true,
                sortable: false,
                emptyCellText: '',
                editor: {
                    xtype: 'textfield',
                    maxLength: 20,
                    selectOnFocus: true
                }
            }, {
                header: 'Observaciones',
                dataIndex: 'comment',
                flex: 1,
                minWidth: 250,
                menuDisabled: true,
                sortable: false,
                emptyCellText: '',
                renderer: function(val, metaData, record, colIndex, store) {
                    if (record.get('comment') != null && record.get('comment') != '') {
                        metaData['tdAttr'] = 'data-qtip="' + val + '"';
                        return val;
                    } else {
                        return;
                    }
                },
                editor: {
                    xtype: 'textfield',
                    selectOnFocus: true
                }
            }, {
                header: 'No. Factura',
                dataIndex: 'code_invoice',
                width: 110,
                align: 'center',
                menuDisabled: true,
                sortable: false,
                emptyCellText: '',
                editor: {
                    xtype: 'textfield',
                    maxLength: 20,
                    selectOnFocus: true
                }
            }, {
                header: 'Importe CUP',
                dataIndex: 'import_invoice',
                width: 100,
                align: 'right',
                menuDisabled: true,
                sortable: false,
                emptyCellText: '',
                editor: {
                    xtype: 'textfield',
                    maxLength: 20,
                    selectOnFocus: true
                }
            }]
        };

        let worksCombo = Ext.create('PHNet.view.shopping.ShoppWorksCombo', {
                id: 'trackingnatworkcombo'
            }),
            dptosCombo = Ext.create('PHNet.view.shopping.ShoppDptosCombo', {
                id: 'trackingnatdptocombo',
                margin: '2 10 2 3'
            });

        me.dockedItems = [{
            xtype: 'toolbar',
            id: 'trackingnatbar',
            cls: 'toolbar',
            height: 49,
            items: [{
                    iconCls: 'fas fa-sync-alt icon-blue',
                    cls: 'toolbar_button',
                    text: '',
                    margin: '2 7 2 2',
                    tooltip: 'Recargar Listado',
                    action: 'reload'
                }, {
                    id: 'natexportbtn',
                    iconCls: 'fas fa-file-export icon-blue',
                    cls: 'toolbar_button',
                    margin: '0 7 0 0',
                    text: '',
                    tooltip: 'Exportar a...',
                    menu: {
                        lid: 'trackingnatExportMenu',
                        items: [
                            { text: 'Informe Adobe PDF', itemId: 'trackingnatPDF', lid: 'trackingnatPDF', id: 'trackingnatPDF', iconCls: 'fas fa-file-pdf', height: 28 },
                            { text: 'Libro de Excel (*.xlsx)', itemId: 'trackingnatExcel', lid: 'trackingnatExcel', iconCls: 'fas fa-file-excel', height: 28 }
                        ]
                    }
                }, {
                    id: 'filterbtn',
                    iconCls: 'fas fa-filter icon-blue',
                    cls: 'toolbar_button',
                    text: '',
                    tooltip: 'Filtrar...',
                    menu: {
                        lid: 'trackingnatFilterMenu',
                        width: 190,
                        items: [{
                                xtype: 'textfield',
                                id: 'search_tracking_field',
                                emptyText: 'Filtrar C\xF3digo/Descripci\xF3n',
                                flex: 1,
                                name: 'search_tracking_field',
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
                                xtype: 'checkboxfield',
                                id: 'track-filter-canceled',
                                boxLabel: 'Solicitudes Canceladas',
                                hidden: true,
                                checked: false,
                                margin: '3 7'
                            }, {
                                text: 'Estado Actual',
                                id: 'filter-trackimp-state',
                                itemId: 'filter-trackimp-state',
                                lid: 'filter-trackimp-state',
                                iconCls: 'fas fa-bell icon-list',
                                menu: {
                                    id: 'filter-trackimp-state-menu',
                                    items: [{
                                        xtype: 'radiofield',
                                        id: 'filter-state-all',
                                        checked: true,
                                        boxLabel: 'Todas',
                                        name: 'filter_menu_state_radio'
                                    }, {
                                        xtype: 'radiofield',
                                        id: 'filter-state-circuit',
                                        boxLabel: 'Circuito Firmas',
                                        name: 'filter_menu_state_radio'
                                    }, {
                                        xtype: 'radiofield',
                                        id: 'filter-state-offert',
                                        boxLabel: 'Oferta',
                                        name: 'filter_menu_state_radio'
                                    }, {
                                        xtype: 'radiofield',
                                        id: 'filter-state-contract',
                                        boxLabel: 'Contratado',
                                        name: 'filter_menu_state_radio'
                                    }, {
                                        xtype: 'radiofield',
                                        id: 'filter-state-supplied',
                                        boxLabel: 'Suministrado',
                                        name: 'filter_menu_state_radio'
                                    }]
                                }
                            }, {
                                text: 'Circuito de Firmas',
                                id: 'filter-tracknat-circuit',
                                itemId: 'filter-tracknat-circuit',
                                lid: 'filter-tracknat-circuit',
                                iconCls: 'fas fa-fingerprint icon-list',
                                menu: {
                                    id: 'filter-tracknat-circuit-menu',
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
                            { text: 'Filtros Avanzados...', itemId: 'trackingnatFilter', lid: 'trackingnatFilter', iconCls: 'fas fa-arrow-right icon-list', height: 28 },
                            { text: 'Borrar Filtros', hidden: true, id: 'menu-filter-remove', itemId: 'trackingnatNoFilter', lid: 'trackingnatNoFilter', iconCls: 'fas fa-times remove', height: 28 }
                        ]
                    }
                }, {
                    xtype: 'box',
                    hidden: true,
                    id: 'box-tracking-filter',
                    margin: '0 10 0 10',
                    cls: 'filter-info',
                    html: '<span class="badge badge-btn-filter"><i class="fas fa-check fa-sm"></i></span>'
                }, '->', worksCombo, dptosCombo
                /*,
                            Ext.create('PHNet.view.app.Monthcombo', {
                                id: 'trackingnatmonthcombo',
                                value: localStorage.getItem('phcp_m')
                            }),
                            Ext.create('PHNet.view.app.Yearcombo', {
                                id: 'trackingnatyearcombo',
                                value: localStorage.getItem('phcp_y')
                            })*/
            ]
        }];

        me.callParent(arguments);

        let work = Ext.getCmp('trackingnatworkcombo').getValue(),
            dpto = Ext.getCmp('trackingnatdptocombo').getValue();
        /*month = Ext.getCmp('trackingnatmonthcombo').getValue(),
        year  = Ext.getCmp('trackingnatyearcombo').getValue();*/

        if (work == null || work == '') { work = -1; }
        if (dpto == null || dpto == '') { dpto = -1; }

        // Load Store
        let proxy = this.getStore().getProxy();
        Ext.apply(proxy.api, {
            read: '/phnet.compras/public/api/tracking/national/' + work + '/' + dpto /* +'/'+ month +'/'+ year*/
        });
        this.getStore().load();

        // Add Events
        me.addEvents('recordedit');
        me.on('edit', function(edt, e) {
            let record = {
                id: e.record.data.id,
                field: e.column.dataIndex,
                oldvalue: e.originalValue,
                newvalue: e.value,
                rowIdx: e.rowIdx,
                colIdx: e.colIdx,
                data: e.record.data
            }
            this.fireEvent('recordedit', record);
        });
    },

    /**
     * Handles the CellEditing plugin's "edit" event
     * @private
     * @param {Ext.grid.plugin.CellEditing} editor
     * @param {Object} e an edit event object
     */
    handleCellEdit: function(editor, e) {
        console.log(e);
        this.fireEvent('recordedit', e);
    }
});