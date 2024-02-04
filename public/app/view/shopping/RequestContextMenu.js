Ext.define('PHNet.view.shopping.RequestContextMenu', {
    extend: 'Ext.menu.Menu',
    xtype: 'requestcontextmenu',
    id: 'requestcontextmenu',
    items: [{
            text: 'Ver Doc. Escaneada',
            iconCls: 'fas fa-file-pdf',
            id: 'showpdfrequest',
            tooltip: 'Documento de los Modelos Escaneados',
            listeners: {
                'click': function(item, e, eOpts) {
                    var grid = Ext.getCmp('shopp711tab'),
                        record = grid.getSelectionModel().getSelection()[0],
                        docname = record.get('document');
                    console.log(docname);
                    this.fireEvent('itemclick', docname);
                }
            }
        }, {
            text: 'Agregar 711 Hijo',
            iconCls: 'fas fa-plus context-menu-icon',
            id: 'addsub711',
            listeners: {
                'click': function(item, e, eOpts) {
                    this.fireEvent('itemclick', item);
                }
            }
        },
        /*{
            text: 'Ver Hist&oacute;rico',
            iconCls: 'fas fa-reply context-menu-icon',
            id: 'requeststory'
        },
        '-',*/
        {
            text: 'Agregar Comentario',
            iconCls: 'fas fa-comment-dots context-menu-icon',
            id: 'rcomment',
            tooltip: 'Comentar Solicitud de Compra seleccionada',
            listeners: {
                'click': function(item, e, eOpts) {
                    var grid = Ext.getCmp('shopp711tab'),
                        record = grid.getSelectionModel().getSelection()[0],
                        reqid = record.get('id'),
                        reqcode = record.get('code');
                    this.fireEvent('itemclick', reqid, reqcode);
                }
            }
        }, {
            text: 'Ver Comentarios',
            iconCls: 'fas fa-comments context-menu-icon',
            id: 'rshowcomment',
            tooltip: 'Ver Comentarios realizados a esta solicitud',
            listeners: {
                'click': function(item, e, eOpts) {
                    var grid = Ext.getCmp('shopp711tab'),
                        record = grid.getSelectionModel().getSelection()[0],
                        reqid = record.get('id'),
                        reqcode = record.get('code');
                    this.fireEvent('itemclick', reqid, reqcode);
                }
            }
        }, '-', {
            text: 'Circuito de Firma',
            id: 'circuit-menu',
            menu: { // <-- submenu by nested config object
                items: [{
                        text: 'Director UBPH',
                        id: 'circuit-dubph',
                        listeners: {
                            'render': function(item, opt) {
                                var grid = Ext.getCmp('shopp711tab'),
                                    record = grid.getSelectionModel().getSelection()[0]
                                if (record.data.gendir_aprove == 1) {
                                    item.setIconCls('fas fa-check');
                                }
                            }
                        }
                    },
                    {
                        text: 'Director de Proyecto',
                        id: 'circuit-dp',
                        listeners: {
                            'render': function(item, opt) {
                                var grid = Ext.getCmp('shopp711tab'),
                                    record = grid.getSelectionModel().getSelection()[0]
                                if (record.data.dir_confirm == 1) {
                                    item.setIconCls('fas fa-check');
                                }
                            }
                        }
                    },
                    {
                        text: 'Jefe de Compras',
                        id: 'circuit-jc',
                        listeners: {
                            'render': function(item, opt) {
                                var grid = Ext.getCmp('shopp711tab'),
                                    record = grid.getSelectionModel().getSelection()[0]
                                if (record.data.comp_comfirm == 1) {
                                    item.setIconCls('fas fa-check');
                                }
                            }
                        }
                    },
                    {
                        text: 'Jefe de Dpto',
                        id: 'circuit-jd',
                        listeners: {
                            'render': function(item, opt) {
                                var grid = Ext.getCmp('shopp711tab'),
                                    record = grid.getSelectionModel().getSelection()[0]
                                if (record.data.dpto_confirm == 1) {
                                    item.setIconCls('fas fa-check');
                                }
                            }
                        }
                    }
                ]
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