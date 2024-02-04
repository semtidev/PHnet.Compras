Ext.define('PHNet.view.gallery.GalleryWindow', {
    extend: 'Ext.window.Window',
    id: 'gallerywindow',
    alias : 'widget.gallerywindow',
    resizable: false,
    width: 950,
    height: 600,
    maximizable: true,
    closable: true,
    layout: 'border',
    modal: true,
    title: 'Asignar Foto al Producto...',
    renderTo: Ext.getBody(),
    bodyStyle: {
        "background": "#1A76CC"
    },

    initComponent: function() {
        this.items = [
            {
                xtype: 'panel',
                title: 'Galer\xEDa de Fotos',
                autoScroll: true,
                id: 'metrogallery',
                region: 'center',
                items: {
                    xtype: 'galleryimageview',
                    region: 'center',
                    layout: 'fit',
                    trackOver: true
                },
                tbar: {
                    cls: 'toolbar bttm-border',
                    height: 49,
                    items: [
                        {
                            iconCls: 'fas fa-sync-alt icon-blue',
                            id: 'gallery-reload',
                            cls: 'toolbar_button',
                            text: '',
                            margin: '2 7 2 2',
                            tooltip: 'Recargar Galer\xEDa',
                            action: 'reload'
                        }, '->',
                        {
                            xtype: 'textfield',
                            id: 'gallery-filter-text',
                            width: 200,
                            name : 'filter',
                            fieldLabel: '<i class="fas fa-filter icon_darkblue"></i>',
                            labelAlign: 'right',
                            emptyText: 'Escriba para filtrar...',
                            labelWidth: 30,
                            listeners: {
                                scope : this,
                                buffer: 50,
                                change: this.filter
                            }
                        },                        
                        {
                            xtype: 'combo',
                            id: 'gallery-filter-category',
                            width: 200,
                            fieldLabel: '<i class="fas fa-filter icon_darkblue"></i>',
                            labelAlign: 'right',
                            labelWidth: 30,
                            valueField: 'field',
                            displayField: 'label',
                            emptyText: 'Filtrar por Categor\xEDa...',
                            editable: true,
                            store: Ext.create('Ext.data.Store', {
                                fields: ['field', 'label'],
                                proxy : {
                                    type: 'memory',
                                    data  : [{label: 'General', field: 'g'}, {label: 'Acabados', field: 'a'}, {label: 'Estructura', field: 'e'}, {label: 'Instalaciones', field: 'i'}]
                                }
                            }),
                            listeners: {
                                scope : this,
                                change: this.filtercat
                            }
                        },                        
                        {
                            xtype: 'combo',
                            id: 'gallery-orderby',
                            width: 160,
                            fieldLabel: '<i class="fas fa-sort-amount-down icon_darkblue"></i>',
                            labelAlign: 'right',
                            labelWidth: 30,
                            valueField: 'field',
                            displayField: 'label',
                            emptyText: 'Ordenar por...',
                            editable: true,
                            store: Ext.create('Ext.data.Store', {
                                fields: ['field', 'label'],
                                sorters: 'type',
                                proxy : {
                                    type: 'memory',
                                    data  : [{label: 'Nombre', field: 'name'}, {label: 'Categor\xEDa', field: 'category'}]
                                }
                            }),
                            listeners: {
                                scope : this,
                                select: this.sort
                            }
                        }
                    ]
                }
            },
            {
                xtype: 'panel',
                id: 'gallery-right',
                region: 'east',
                padding: '0 0 0 5',
                width: 260,
                bodyStyle: {
                    "background-color": "#F7FBFE"
                },
                items: [],
                dockedItems: [{
                    xtype: 'toolbar',
                    dock: 'bottom',
                    cls: 'btoolbar',
                    height: 50,
                    items: [{
                        id: 'gallery-btn-addphoto',
                        text: '<i class="fas fa-plus"></i>&nbsp;&nbsp;Agregar Foto ...',
                        cls: 'app-form-btn text-white btn',
                        scale: 'medium',
                        margin: '3 0 3 50',
                        action: 'addphoto'
                    }, {
                        id: 'galleryform-btn-store',
                        text: '<i class="fas fa-check"></i>&nbsp;&nbsp;Aceptar',
                        cls: 'app-form-btn text-white btn',
                        hidden: true,
                        scale: 'medium',
                        margin: '3 0 3 23',
                        action: 'storephoto'
                    }, {
                        id: 'galleryform-btn-select',
                        text: '<i class="fas fa-check"></i>&nbsp;&nbsp;Aceptar',
                        cls: 'app-form-btn text-white btn',
                        hidden: true,
                        scale: 'medium',
                        margin: '3 0 3 23',
                        action: 'storephoto'
                    }, {
                        id: 'gallery-btn-calcel',
                        text: '<i class="fas fa-times"></i>&nbsp;&nbsp;Cancelar',
                        cls: 'app-form-btn text-white btn',
                        hidden: true,
                        scale: 'medium',
                        margin: '3 0 3 5',
                        action: 'cancelphoto'
                    }]
                }]
            }
        ];

        this.callParent(arguments);
    },

    filter: function(field, newValue) {
        let store = this.down('galleryimageview').store,
            view = this.down('dataview'),
            selModel = view.getSelectionModel(),
            selection = selModel.getSelection()[0];
        
        store.suspendEvents();
        store.clearFilter();
        store.filter({
            property: 'src',
            anyMatch: true,
            value   : newValue
        });
        store.resumeEvents();
        /*if (selection && store.indexOf(selection) === -1) {
            selModel.clearSelections();
            this.down('infopanel').clear();
        }*/
        view.refresh();
        
    },

    filtercat: function(field, newValue) {
        console.log(newValue);
        let store = this.down('galleryimageview').store,
            view = this.down('dataview'),
            selModel = view.getSelectionModel(),
            selection = selModel.getSelection()[0];
        
        store.suspendEvents();
        store.clearFilter();
        if (newValue == '') {
           store.load();
        }
        else if (newValue == null) {
            return false;
        }
        else{
            store.filter({
                property: 'category',
                anyMatch: true,
                value   : newValue
            });
        }
        store.resumeEvents();
        view.refresh();
        
    },

    sort: function() {
        var field = Ext.getCmp('gallery-orderby').getValue();        
        this.down('dataview').store.sort(field);
    },

});