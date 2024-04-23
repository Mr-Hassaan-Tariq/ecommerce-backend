export const responseMessages = Object.freeze({
    // Success responses
    OK: 'OK',
    CREATED: 'Resource created successfully',
    NO_CONTENT: 'No content',

    // Client errors
    BAD_REQUEST: 'Bad request',
    UNAUTHORIZED: 'Unauthorized',
    FORBIDDEN: 'Forbidden',
    NOT_FOUND: 'Resource not found',
    CONFLICT: 'Conflict',
    OTP: 'Invalid OTP',
    NOT_MODIFIED: 'Resource Not Modified',

    // Server errors
    INTERNAL_SERVER_ERROR: 'Internal server error',
});
export const ROLES = Object.freeze({
    SUPER_ADMIN: "Super Admin",
    ADMIN: "Admin",
    USER: "User",
    GUEST_USER: "Guest"
})

export const Valide_CATEGORIES = [
    {
        id: 2093315,
        name: 'E-LIQUID',
    }, {
        id: 2093317,
        name: 'Freebase',
    }, {
        id: 3332903,
        name: 'Tobacco Free'
    }, {
        id: 3332901,
        name: 'Tobacco Free'
    }, {
        id: 2093319,
        name: 'Salt',
    }, {
        id: 2093321,
        name: 'DISPOSABLES'
    }, {
        id: 3116448,
        name: 'DISPOSABLES',
    }, {
        id: 2093320,
        name: 'VAPE'
    }, {
        id: 2093325,
        name: 'PRE-FILLED PODS',
    },
]

export const ORDER_STATUS = Object.freeze({
    PENDING: 'pending',
    PROCESSING: 'processing',
    COMPLETED: 'completed',
    CANCELLED: "cancelled"
})
export const CSERIES = Object.freeze({
    AladdinGv: 1,
    dispolabs: 2
})

export const PRODUCT_UPDATE_MESSAGE = Object.freeze({
    DEFAULT: "",
    SUCCESS: "Synced successfully."
})

export const PaymentTypeID = '22'
export const DISPO_LABS_EMPLOYEE = '128'
export const REGISTER_ID = '12'
export const SHOP_ID = '10'
export const IS_PRODUCT_UPDATE_FAILED = true

export const C_SERIES_NAMES = Object.freeze({
    DISPOLABS: 'DISPOLABS',
    STONER_MOM: 'STONER_MOM'
})

export const PRODUCT_QUEUE_STATUS = Object.freeze({
    NEW: "NEW",
    IN_PROGRESS: "IN_PROGRESS",
    FAILED: "FAILED",
    COMPLETE: "COMPLETE"
})

export const DISPOLABS_SHIPPING = '39488'