export interface Department {
    departmentId: string,
    departmentName: string
}

export interface Departments {
    departments: [Department],
    categories: [Department],
    subCategories: [Department]


}