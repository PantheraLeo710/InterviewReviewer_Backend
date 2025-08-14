function requireRole(role) {
  return (req, res, next) => {
    console.log("Inside requireRole, user:", req.user);

    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized - No user' });
    }

    if (role === 'staff' && !req.user.isStaff) {
      return res.status(403).json({ message: 'Forbidden - Staff only' });
    }

    next();
  };
}

module.exports = requireRole;
