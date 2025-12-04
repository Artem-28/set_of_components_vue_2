const value = [
    // { from: 'right', to: 'left' }, //ok
    // { from: 'right', to: 'top' }, // ok
    // { from: 'right', to: 'right' }, //ok
    { from: 'right', to: 'bottom' },

    { from: 'bottom', to: 'left' },
    // { from: 'bottom', to: 'top' }, //ok
    { from: 'bottom', to: 'right' },
    // { from: 'bottom', to: 'bottom' },

    // { from: 'left', to: 'left' }, // ok
    // { from: 'left', to: 'top' }, // ok
    // { from: 'left', to: 'right' }, //ok
    { from: 'left', to: 'bottom' },

    // { from: 'top', to: 'left' },
    // { from: 'top', to: 'top' },
    { from: 'top', to: 'right' },
    // { from: 'top', to: 'bottom' }
]

export const useViews = () => {
    const views = {
        'left_top': [
            { from: 'right', to: 'left' },
            { from: 'right', to: 'top' },
            { from: 'bottom', to: 'left' },
            { from: 'bottom', to: 'top' },
            { from: 'top', to: 'top' },
            { from: 'bottom', to: 'bottom' },
            { from: 'left', to: 'left' },
            { from: 'right', to: 'right' },
            { from: 'top', to: 'bottom' },
            { from: 'left', to: 'right' },
            { from: 'left', to: 'top' },
            { from: 'top', to: 'left' },
            { from: 'right', to: 'bottom' },
            { from: 'bottom', to: 'right' },
            { from: 'left', to: 'bottom' },
            { from: 'top', to: 'right' },
        ],
        'left_bottom': [
            { from: 'right', to: 'left' },
            { from: 'right', to: 'bottom' },
            { from: 'top', to: 'left' },
            { from: 'top', to: 'bottom' },
            { from: 'bottom', to: 'bottom' },
            { from: 'top', to: 'top' },
            { from: 'left', to: 'left' },
            { from: 'right', to: 'top' },
            { from: 'bottom', to: 'left' },
            { from: 'bottom', to: 'top' },
            { from: 'left', to: 'bottom' },
            { from: 'left', to: 'top' },
            { from: 'right', to: 'right' },
            { from: 'bottom', to: 'right' },
            { from: 'top', to: 'right' },
            { from: 'left', to: 'right' },
        ],
        'left_middle': [
            { from: 'right', to: 'left' },
            { from: 'bottom', to: 'left' },
            { from: 'top', to: 'left' },
            { from: 'right', to: 'top' },
            { from: 'right', to: 'bottom' },
            { from: 'top', to: 'top' },
            { from: 'bottom', to: 'bottom' },
            { from: 'top', to: 'bottom' },
            { from: 'bottom', to: 'top' },
            { from: 'left', to: 'left' },
            { from: 'left', to: 'top' },
            { from: 'left', to: 'bottom' },
            { from: 'bottom', to: 'right' },
            { from: 'top', to: 'right' },
            { from: 'right', to: 'right' },
            { from: 'left', to: 'right' },
        ],
        'middle_bottom': [
            { from: 'top', to: 'bottom' },
            { from: 'left', to: 'bottom' },
            { from: 'right', to: 'bottom' },
            { from: 'right', to: 'right' },
            { from: 'left', to: 'left' },
            { from: 'right', to: 'left' },
            { from: 'left', to: 'right' },
            { from: 'top', to: 'left' },
            { from: 'top', to: 'right' },
            { from: 'bottom', to: 'left' },
            { from: 'bottom', to: 'right' },
            { from: 'bottom', to: 'bottom' },
            { from: 'left', to: 'top' },
            { from: 'right', to: 'top' },
            { from: 'top', to: 'top' },
            { from: 'bottom', to: 'top' },
        ],
        'middle_top': [
            { from: 'bottom', to: 'top' },
            { from: 'left', to: 'top' },
            { from: 'right', to: 'top' },
            { from: 'right', to: 'right' },
            { from: 'left', to: 'left' },
            { from: 'right', to: 'left' },
            { from: 'left', to: 'right' },
        ]
    }

    function get(direction) {
        return  { from: 'top', to: 'right' }
        // const list = views[direction] || [];
        // if (list.length === 0) return null;
        // return list[list.length - 1]
    }

    return { get }
}