import moment from 'moment';

export const getPaddedDate = (date: Date) => {
    return (
        ('0' + (date.getUTCMonth() + 1)).slice(-2) + '/' +
        ('0' + date.getUTCDate()).slice(-2) + '/' +
        date.getUTCFullYear()
    )
}

export const dateFormatConverter = (date: string, sourceFormat: string, destinationFormat: string) => {
    return moment(date, sourceFormat).format(destinationFormat)
}

export const convertDateToUTC=(date:Date) =>{ 
    return new Date(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds()); 
    }