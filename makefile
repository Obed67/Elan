.PHONY: buildnrun bnr help

# The default goal is 'help'
.DEFAULT_GOAL := help

# Main build and run target
buildnrun:
	@$(MAKE) -s _buildnrun CMD=$(filter-out $@,$(MAKECMDGOALS))

# Alias for buildnrun
bnr:
	@$(MAKE) -s _buildnrun CMD=$(filter-out $@,$(MAKECMDGOALS))

# Internal buildnrun target
_buildnrun:
ifeq ($(CMD),app)
	docker build -f apps/app/Dockerfile -t elan/app --network host .
	docker run -e PORT=8080 --network host elan/app
else ifeq ($(CMD),landing)
	docker build -f apps/landing/Dockerfile -t elan/landing --network host .
	docker run -e PORT=8080 --network host elan/landing
else ifeq ($(CMD),cron)
	docker build -f apps/cron/Dockerfile -t elan/cron --network host .
	docker run --network host elan/cron
else
	@echo "Please provide a valid target. List of available targets:"
	@echo "  - app"
	@echo "  - landing"
	@echo "  - cron
endif

# Help message
help:
	@echo "Available commands:"
	@echo "  make buildnrun <target>   - Build and run the Docker container for <targt>"
	@echo "  make bnr <target>         - Alias for buildnrun <target>"
	@echo "  make help                 - Display this help message"