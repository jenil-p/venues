export function validate(schema) {
    return (req, res, next) => {
        const result = schema.safeParse({
            body:   req.body,
            params: req.params,
            query:  req.query,
        });

        if (!result.success) {
            const errors = result.error.errors.map(e => ({
                field:   e.path.join('.'),
                message: e.message,
            }));
            return res.status(400).json({ message: "Validation failed", errors });
        }

        // Write parsed+transformed values back so controller gets clean data
        req.body   = result.data.body   ?? req.body;
        req.params = result.data.params ?? req.params;
        // req.query  = result.data.query  ?? req.query;
        Object.assign(req.query, result.data.query);

        next();
    };
}