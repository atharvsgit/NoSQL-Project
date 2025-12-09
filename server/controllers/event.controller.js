const Event = require('../models/Event.model');
const Registration = require('../models/Registration.model');

// @desc    Create a new event
// @route   POST /api/events
// @access  Private (Faculty, Admin)
exports.createEvent = async (req, res) => {
  try {
    const { title, description, department, date, venue, capacity } = req.body;

    const event = await Event.create({
      title,
      description,
      organizer: req.user._id,
      department,
      date,
      venue,
      capacity,
      status: 'PENDING',
    });

    const populatedEvent = await Event.findById(event._id).populate(
      'organizer',
      'name email department'
    );

    res.status(201).json({
      success: true,
      message: 'Event created successfully',
      data: populatedEvent,
    });
  } catch (error) {
    console.error('Create event error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error creating event',
    });
  }
};

// @desc    Get all approved events
// @route   GET /api/events
// @access  Public
exports.getApprovedEvents = async (req, res) => {
  try {
    const { department, startDate, endDate } = req.query;
    
    let query = { status: 'APPROVED' };
    
    if (department) {
      query.department = department;
    }
    
    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }

    const events = await Event.find(query)
      .populate('organizer', 'name email department')
      .sort({ date: 1 });

    res.status(200).json({
      success: true,
      count: events.length,
      data: events,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching events',
    });
  }
};

// @desc    Get all events (including pending/rejected)
// @route   GET /api/events/all
// @access  Private (Faculty, Admin, HOD)
exports.getAllEvents = async (req, res) => {
  try {
    const { department, status } = req.query;
    
    let query = {};
    
    if (department) {
      query.department = department;
    }
    
    if (status) {
      query.status = status;
    }

    const events = await Event.find(query)
      .populate('organizer', 'name email department')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: events.length,
      data: events,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching events',
    });
  }
};

// @desc    Get single event by ID
// @route   GET /api/events/:id
// @access  Public
exports.getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id).populate(
      'organizer',
      'name email department'
    );

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found',
      });
    }

    res.status(200).json({
      success: true,
      data: event,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching event',
    });
  }
};

// @desc    Update event details
// @route   PUT /api/events/:id
// @access  Private (Faculty - own event, Admin)
exports.updateEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found',
      });
    }

    // Check if user is the organizer or admin
    if (
      event.organizer.toString() !== req.user._id.toString() &&
      req.user.role !== 'ADMIN'
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this event',
      });
    }

    const { title, description, date, venue, capacity } = req.body;

    const updatedEvent = await Event.findByIdAndUpdate(
      req.params.id,
      { title, description, date, venue, capacity },
      { new: true, runValidators: true }
    ).populate('organizer', 'name email department');

    res.status(200).json({
      success: true,
      message: 'Event updated successfully',
      data: updatedEvent,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating event',
    });
  }
};

// @desc    Update event status (Approve/Reject)
// @route   PUT /api/events/status/:id
// @access  Private (Admin, HOD)
exports.updateEventStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!['APPROVED', 'REJECTED'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status',
      });
    }

    const event = await Event.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    ).populate('organizer', 'name email department');

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found',
      });
    }

    res.status(200).json({
      success: true,
      message: `Event ${status.toLowerCase()} successfully`,
      data: event,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating event status',
    });
  }
};

// @desc    Delete an event
// @route   DELETE /api/events/:id
// @access  Private (Faculty - own event, Admin)
exports.deleteEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found',
      });
    }

    // Check if user is the organizer or admin
    if (
      event.organizer.toString() !== req.user._id.toString() &&
      req.user.role !== 'ADMIN'
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this event',
      });
    }

    // Delete all registrations for this event
    await Registration.deleteMany({ event: req.params.id });

    await Event.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Event deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting event',
    });
  }
};
