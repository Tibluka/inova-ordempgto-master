import * as _moment from 'moment';

export function toBRDate(dt: string) {
    if (dt === null) return
    // let date = new Date(dt)
    // return `${date.getDate().toString().padStart(2,'0')}/${(date.getMonth()+1).toString().padStart(2,'0')}/${date.getFullYear()}`

    dt = dt.split("T")[0];
    let data = dt.split('-')
    return `${data[2]}/${data[1]}/${data[0]}`
}

export function getPeriodoDefaultISO() {
    let periodo = {}
    let periodoDe = new Date()
    periodoDe.setDate(new Date().getDate() - 7)
    periodo['periodoDe'] = periodoDe.toISOString();
    periodo['periodoAte'] = new Date().toISOString()

    return periodo
}

export function getPeriodoDefault() {
    let periodo = {}
    let periodoDe = _moment()
    periodoDe.set('date', periodoDe.get('date') - 7)
    periodo['periodoDe'] = periodoDe
    periodo['periodoAte'] = new Date()

    return periodo
}