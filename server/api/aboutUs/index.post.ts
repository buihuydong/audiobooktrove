export default defineEventHandler(async (event) => {
    const api = process.env.API;
    const url = `${api}/about-us`
    try {
        const res = await $fetch(url);
        return {
            status: 201,
            message: 'Success fetching about us.',
            data: res,
        };
    } catch (error) {
        return sendError(event, createError({
            statusCode: 500,
            message: 'Error fetching about us.'
        }));
    }
})