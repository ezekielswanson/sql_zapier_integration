# Donor Family Contact Upsert

This script handles the automatic creation and updating of contact records in HubSpot when surgery orders are created in Midwire Match. It's designed to work as part of a Zapier integration between Midwire Match and HubSpot CRM.

## Overview

The script processes donor family contact information from Midwire Match and ensures proper formatting before creating or updating records in HubSpot. It specifically handles:

- Contact information validation
- Phone number formatting
- Communication preference settings
- Donor and case information

## Prerequisites

- HubSpot API access token (stored as environment variable)
- Zapier integration set up between Midwire Match and HubSpot
- Node.js environment

## Environment Variables

Create a `.env` file in your project root with:
