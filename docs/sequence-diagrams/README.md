# Sequence Diagrams

This folder contains sequence diagrams documenting all application flows in the Nurse Call System.

## Structure

Sequence diagrams are organized by feature/domain area:

### Notifications

- **get-notifications.puml** - Flow for retrieving all notifications (GET /notifications)
- **confirm-for-user.puml** - Flow for user confirmation (POST /notifications/:id/confirm-for-user)
- **confirm-for-event.puml** - Flow for event-based auto-confirmation (POST /notifications/:id/confirm-for-event)
- **send-signals.puml** - Detailed signal sending logic with all conditional checks
- **publish.puml** - Notification publishing flow

## Viewing the Diagrams

1. **Online**: Use [PlantUML Online Server](http://www.plantuml.com/plantuml/uml/)
2. **VS Code**: Install PlantUML extension
3. **Command Line**: Use PlantUML tool to generate PNG files

## Generating PNG Files

```bash
# Install PlantUML (if not already installed)
# Then run:
plantuml docs/sequence-diagrams/**/*.puml
```

This will generate PNG files alongside each .puml file.
