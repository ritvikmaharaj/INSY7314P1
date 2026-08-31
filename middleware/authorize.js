// Author: Saheel Bhugwandeen
// Role-based access control (RBAC) middleware.
// Runs AFTER authMiddleware's `protect`, which attaches req.user from the JWT.
// Restricts specific routes to specific user roles (e.g. only "freelancer"
// can create a gig, only "client" can make a booking).
const authorize = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req.user || !req.user.role) {
            return res.status(401).json({ error: "Not authenticated." });
        }

        if (!allowedRoles.includes(req.user.role)) {
            return res.status(403).json({
                error: "You do not have permission to perform this action."
            });
        }

        next();
    };
};

module.exports = authorize;