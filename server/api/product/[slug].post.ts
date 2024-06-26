export default defineEventHandler(async (event) => {
    const api = process.env.API;
    const slug = getRouterParam(event, 'slug');
    let url = `${api}/product/${slug}`;
    
    try {
        const res = await $fetch(url);
        return {
            status: 201,
            message: 'Success fetching product.',
            data: res,
            url: url
        };
    } catch (error) {
        return sendError(event, createError({
            statusCode: 500,
            message: 'Error fetching product.'
        }));
    }
});
