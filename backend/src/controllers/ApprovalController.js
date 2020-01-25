const Booking = require('../models/Booking');

module.exports = {
    async store(req, res) {

        const { booking_id } = req.params;

        const booking = await Booking.findById(booking_id).populate('spot');

        booking.approved = true;

        await booking.save();

        const bookingtUserSocket = req.connectedUsers[booking.user];

        if (bookingtUserSocket) {
            req.io.to(bookingtUserSocket).emit('booking_response', booking);
        }

        return res.json(booking);
    }
}