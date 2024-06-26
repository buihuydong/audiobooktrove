export default defineEventHandler(async (event) => {
    const api = process.env.API;
    const id = getRouterParam(event, 'id');
    const url = `${api}/transaction-count/${id}`;
    try {
        const res = await $fetch(url);

        return {
            status: 201,
            message: 'Success fetching transaction count.',
            data: res,
        };
    } catch (error) {
        return sendError(event, createError({
            statusCode: 500,
            message: 'Error fetching transaction count.'
        }));
    }
})