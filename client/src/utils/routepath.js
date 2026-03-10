const computePath = (mode, base, id = null) => {
    switch (mode) {
        case 'workout':
            return '/shared/workout/' + id + base
        case 'send':
            return '/sendProgram/' + id + base
        case 'edit':
            return '/editProgram/' + id + base
        case 'customize':
            return '/clientProfile/' + id + base
        case 'create':
            return '/createProgram' + base
    }
}

export { computePath }
