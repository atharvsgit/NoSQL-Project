const Registration = require('../models/Registration.model');
const Event = require('../models/Event.model');

// @desc    Register for an event
// @route   POST /api/registrations/:eventId
// @access  Private (Student)
exports.registerForEvent = async (req, res) => {
  try {
    const { eventId } = req.params;
    const userId = req.user._id;

    // Check if event exists and is approved
    const event = await Event.findById(eventId);
    
    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found',
      });
    }

    if (event.status !== 'APPROVED') {
      return res.status(400).json({
        success: false,
        message: 'Cannot register for this event. Event is not approved.',
      });
    }

    // Check if event has capacity and is full
    if (event.capacity && event.registrationsCount >= event.capacity) {
      return res.status(400).json({
        success: false,
        message: 'Event is full. Registration capacity reached.',
      });
    }

    // Check if user is already registered
    const existingRegistration = await Registration.findOne({
      event: eventId,
      user: userId,
    });

    if (existingRegistration) {
      return res.status(400).json({
        success: false,
        message: 'You are already registered for this event',
      });
    }

    // Create registration
    const registration = await Registration.create({
      event: eventId,
      user: userId,
    });

    // Increment event registrations count
    await Event.findByIdAndUpdate(eventId, {
      $inc: { registrationsCount: 1 },
    });

    const populatedRegistration = await Registration.findById(registration._id)
      .populate('event', 'title description date venue')
      .populate('user', 'name email department');

    res.status(201).json({
      success: true,
      message: 'Successfully registered for the event',
      data: populatedRegistration,
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error registering for event',
    });
  }
};

// @desc    Get all registrations for logged-in user
// @route   GET /api/registrations/user
// @access  Private
exports.getUserRegistrations = async (req, res) => {
  try {
    const registrations = await Registration.find({ user: req.user._id })
      .populate('event', 'title description date venue status department')
      .sort({ registeredAt: -1 });

    res.status(200).json({
      success: true,
      count: registrations.length,
      data: registrations,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching registrations',
    });
  }
};

// @desc    Get all registrations for a specific event
// @route   GET /api/registrations/event/:eventId
// @access  Private (Faculty - own event, Admin)
exports.getEventRegistrations = async (req, res) => {
  try {
    const { eventId } = req.params;

    // Check if event exists
    const event = await Event.findById(eventId);
    
    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found',
      });
    }

    // Check authorization - must be organizer or admin
    if (
      event.organizer.toString() !== req.user._id.toString() &&
      req.user.role !== 'ADMIN'
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view registrations for this event',
      });
    }

    const registrations = await Registration.find({ event: eventId })
      .populate('user', 'name email department role')
      .sort({ registeredAt: -1 });

    res.status(200).json({
      success: true,
      count: registrations.length,
      data: registrations,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching event registrations',
    });
  }
};

// @desc    Unregister from an event
// @route   DELETE /api/registrations/:eventId
// @access  Private (Student)
exports.unregisterFromEvent = async (req, res) => {
  try {
    const { eventId } = req.params;
    const userId = req.user._id;

    const registration = await Registration.findOneAndDelete({
      event: eventId,
      user: userId,
    });

    if (!registration) {
      return res.status(404).json({
        success: false,
        message: 'Registration not found',
      });
    }

    // Decrement event registrations count
    await Event.findByIdAndUpdate(eventId, {
      $inc: { registrationsCount: -1 },
    });

    res.status(200).json({
      success: true,
      message: 'Successfully unregistered from the event',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error unregistering from event',
    });
  }
};

// @desc    Mark attendee as attended (check-in)
// @route   PUT /api/registrations/checkin/:registrationId
// @access  Private (Faculty, Admin)
exports.checkInAttendee = async (req, res) => {
  try {
    const { registrationId } = req.params;

    const registration = await Registration.findById(registrationId).populate('event');

    if (!registration) {
      return res.status(404).json({
        success: false,
        message: 'Registration not found',
      });
    }

    // Check authorization - must be event organizer or admin
    if (
      registration.event.organizer.toString() !== req.user._id.toString() &&
      req.user.role !== 'ADMIN'
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to check-in attendees for this event',
      });
    }

    registration.attended = true;
    await registration.save();

    const updatedRegistration = await Registration.findById(registrationId)
      .populate('event', 'title date venue')
      .populate('user', 'name email department');

    res.status(200).json({
      success: true,
      message: 'Attendee checked in successfully',
      data: updatedRegistration,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error checking in attendee',
    });
  }
};
