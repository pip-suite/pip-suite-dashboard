export interface IDashboardTile {
    options: any;
    color: string;
    size: Object | string | number;
    menu: any;
}

export class DashboardTile implements IDashboardTile {
    public options: any;
    public color: string;
    public size: Object | string | number;
    public menu: any = [{
        title: 'Change Size',
        action: angular.noop,
        submenu: [{
                title: '1 x 1',
                action: () => { this.changeSize({sizeX: 1, sizeY: 1}) },
                params: {
                    sizeX: 1,
                    sizeY: 1
                }
            },
            {
                title: '2 x 1',
                action: 'changeSize',
                params: {
                    sizeX: 2,
                    sizeY: 1
                }
            },
            {
                title: '2 x 2',
                action: 'changeSize',
                params: {
                    sizeX: 2,
                    sizeY: 2
                }
            }
        ]
    }];

    constructor() {}

    protected changeSize(params) {
        this.options.size.colSpan = params.sizeX;
        this.options.size.rowSpan = params.sizeY;
    }
}