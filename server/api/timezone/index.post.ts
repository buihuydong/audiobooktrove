export default defineEventHandler(async (event) => {
    const api = process.env.API;
    const url = `${api}/timezone`;
    try {
        const res = await $fetch(url);
        return {
            status: 201,
            message: 'Success fetching timezone.',
            data: res,
        };
    } catch (error) {
        return sendError(event, createError({
            statusCode: 500,
            message: 'Error fetching timezone.'
        }));
    }
})