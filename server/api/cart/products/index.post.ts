export default defineEventHandler(async (event) => {
    const body = await readBody(event);
    const api = process.env.API;
    const params = new URLSearchParams();
    const url = `${api}/carts`;
    let ids = body.ids || null;

    if (ids && Array.isArray(ids)) {
        const idsArray = ids.map(item => item.id);
        const idsString = idsArray.join(',');
        params.append('ids', idsString);
    }

    try {
        const res = await $fetch(`${url}?${params.toString()}`);
        return {
            status: 201,
            message: 'Success fetching carts.',
            data: res,
        };
    } catch (error) {
        return sendError(event, createError({
            statusCode: 500,
            message: 'Error fetching carts.'
        }));
    }
});
