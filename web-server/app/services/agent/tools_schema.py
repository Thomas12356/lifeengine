TOOLS_SCHEMA = [
    {
        "type": "function",
        "function": {
            "name": "create_event_tool",
            "description": (
                "Create a new calendar event. Use this when the user wants to add, create, schedule, or put something in their calendar."
            ),
            "parameters": {
                "type": "object",
                "properties": {
                    "title": {
                        "type": "string",
                        "description": "The title of the event, for example gym, lecture, meeting.",
                    },
                    "date_text": {
                        "type": "string",
                        "description": "Natural date phrase, for example today, tomorrow, next Monday.",
                    },
                    "start_text": {
                        "type": "string",
                        "description": "Natural start time phrase, for example 5pm, 17:00, in an hour.",
                    },
                    "end_text": {
                        "type": "string",
                        "description": "Natural end time phrase, for example 6pm, 18:00.",
                    },

                },
                "required": ["title", "date_text", "start_text", "end_text"],
            },
        },
    },

]