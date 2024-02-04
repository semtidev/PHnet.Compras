Ext.define('PHNet.view.tracking.TrackingContextMenu', {
    extend: 'Ext.menu.Menu',
    xtype: 'trackingcontextmenu',
    id: 'trackingcontextmenu',
    width: 180,
    items: [{
            text: 'Estado Actual',
            id: 'menu-tracking-state',
            iconCls: 'fas fa-check context-menu-icon',
            menu: {
                items: [{
                        text: 'Circuito de Firma',
                        id: 'trackmenu_circuit',
                        listeners: {
                            'render': function(item, opt) {
                                let window = Ext.getCmp(localStorage.getItem('phcp_win_id')),
                                    grid = window.down('treepanel'),
                                    record = grid.getSelectionModel().getSelection()[0]
                                if (record.data.state == 'Circuito Firmas') {
                                    item.setIconCls('fas fa-check');
                                } else {
                                    item.setIconCls('no-icon');
                                }
                            },
                            'click': function(item, e, eOpts) {
                                this.fireEvent('itemclick', item);
                            }
                        }
                    },
                    {
                        text: 'En Oferta',
                        id: 'trackmenu_offer',
                        listeners: {
                            'render': function(item, opt) {
                                let window = Ext.getCmp(localStorage.getItem('phcp_win_id')),
                                    grid = window.down('treepanel'),
                                    record = grid.getSelectionModel().getSelection()[0]
                                if (record.data.state == 'Oferta') {
                                    item.setIconCls('fas fa-check');
                                } else {
                                    item.setIconCls('no-icon');
                                }
                            },
                            'click': function(item, e, eOpts) {
                                this.fireEvent('itemclick', item);
                            }
                        }
                    },
                    {
                        text: 'Contratado',
                        id: 'trackmenu_contract',
                        listeners: {
                            'render': function(item, opt) {
                                let window = Ext.getCmp(localStorage.getItem('phcp_win_id')),
                                    grid = window.down('treepanel'),
                                    record = grid.getSelectionModel().getSelection()[0]
                                if (record.data.state == 'Contratado') {
                                    item.setIconCls('fas fa-check');
                                } else {
                                    item.setIconCls('no-icon');
                                }
                            },
                            'click': function(item, e, eOpts) {
                                this.fireEvent('itemclick', item);
                            }
                        }
                    },
                    {
                        text: 'Suministrado',
                        id: 'trackmenu_supply',
                        listeners: {
                            'render': function(item, opt) {
                                let window = Ext.getCmp(localStorage.getItem('phcp_win_id')),
                                    grid = window.down('treepanel'),
                                    record = grid.getSelectionModel().getSelection()[0]
                                if (record.data.state == 'Suministrado') {
                                    item.setIconCls('fas fa-check');
                                } else {
                                    item.setIconCls('no-icon');
                                }
                            },
                            'click': function(item, e, eOpts) {
                                this.fireEvent('itemclick', item);
                            }
                        }
                    }
                ]
            }
        },
        {
            text: 'Agregar Comentario',
            iconCls: 'fas fa-comment-dots context-menu-icon',
            id: 'trackcomment',
            tooltip: 'Comentar Solicitud de Compra seleccionada',
            listeners: {
                'click': function(item, e, eOpts) {
                    let window = Ext.getCmp(localStorage.getItem('phcp_win_id')),
                        grid = window.down('treepanel'),
                        record = grid.getSelectionModel().getSelection()[0],
                        reqid = record.get('id'),
                        reqcode = record.get('codedb');
                    this.fireEvent('itemclick', reqid, reqcode);
                }
            }
        }, {
            text: 'Ver Comentarios',
            iconCls: 'fas fa-comments context-menu-icon',
            id: 'trackshowcomment',
            tooltip: 'Ver Comentarios realizados a esta solicitud',
            listeners: {
                'click': function(item, e, eOpts) {
                    let window = Ext.getCmp(localStorage.getItem('phcp_win_id')),
                        grid = window.down('treepanel'),
                        record = grid.getSelectionModel().getSelection()[0],
                        reqid = record.get('id'),
                        reqcode = record.get('codedb');
                    this.fireEvent('itemclick', reqid, reqcode);
                }
            }
        }, (localStorage.getItem('phcp_ud') == 5 ? '-' : ''), {
            xtype: 'datefield',
            id: 'menu-ubidate',
            fieldLabel: 'Fecha Entrega UBI',
            labelAlign: 'top',
            margin: '0 10 10 10',
            name: 'menu_ubidatefield',
            listeners: {
                render: function(datefield, eOpts) {
                    let window = Ext.getCmp(localStorage.getItem('phcp_win_id')),
                        grid = window.down('treepanel'),
                        record = grid.getSelectionModel().getSelection()[0],
                        ubidate = record.get('ubidate');
                    datefield.setValue(ubidate);
                },
                select: function(datefield, value, eOpts) {
                    let window = Ext.getCmp(localStorage.getItem('phcp_win_id')),
                        grid = window.down('treepanel'),
                        record = grid.getSelectionModel().getSelection()[0],
                        reqid = record.get('id'),
                        ubidate = Ext.Date.format(value, 'Y-m-j');
                    Ext.getCmp('menu-ubidate').fireEvent('ubidate', reqid, ubidate);
                }
            }
        },
        {
            text: 'Cancelar Solicitud',
            id: 'menu-cancel-request',
            iconCls: 'fas fa-ban context-menu-icon',
            listeners: {
                'click': function(item, e, eOpts) {
                    let window = Ext.getCmp(localStorage.getItem('phcp_win_id')),
                        grid = window.down('treepanel'),
                        record = grid.getSelectionModel().getSelection()[0],
                        reqid = record.get('id'),
                        reqcode = record.get('codedb');
                    this.fireEvent('itemclick', reqid, reqcode);
                }
            }
        },
        {
            text: 'Activar Solicitud',
            id: 'menu-active-request',
            iconCls: 'fas fa-shopping-cart context-menu-icon',
            listeners: {
                'click': function(item, e, eOpts) {
                    let window = Ext.getCmp(localStorage.getItem('phcp_win_id')),
                        grid = window.down('treepanel'),
                        record = grid.getSelectionModel().getSelection()[0],
                        reqid = record.get('id');
                    this.fireEvent('itemclick', reqid);
                }
            }
        }
    ],
    /**
     * Associates this menu with a specific list.
     * @param {SimpleTasks.model.List} list
     */
    setList: function(list) {
        this.list = list;
    },
    /**
     * Gets the list associated with this menu
     * @return {Task.model.List}
     */
    getList: function() {
        return this.list;
    }
});