"""
Lead storage and extraction module.
Saves captured leads to leads.json and extracts contact info from conversation.
"""

import json
import re
import os
from datetime import datetime
from typing import Optional

LEADS_FILE = "leads.json"


def _load_leads() -> list:
    """Load existing leads from JSON file."""
    if not os.path.exists(LEADS_FILE):
        return []
    with open(LEADS_FILE, "r") as f:
        try:
            return json.load(f)
        except json.JSONDecodeError:
            return []


def _save_leads(leads: list) -> None:
    """Persist leads list to JSON file."""
    with open(LEADS_FILE, "w") as f:
        json.dump(leads, f, indent=2)


def save_lead(session_id: str, lead_data: dict) -> None:
    """
    Save or update a lead entry for a session.
    Merges new data into an existing entry if the session already exists.
    """
    leads = _load_leads()

    # Find existing lead for this session
    existing = next((l for l in leads if l.get("session_id") == session_id), None)

    if existing:
        existing.update(lead_data)
        existing["updated_at"] = datetime.utcnow().isoformat()
    else:
        leads.append({
            "session_id": session_id,
            "created_at": datetime.utcnow().isoformat(),
            "updated_at": datetime.utcnow().isoformat(),
            **lead_data,
        })

    _save_leads(leads)


def extract_lead_info(text: str) -> dict:
    """
    Attempt to extract contact info from a message using regex patterns.
    Returns a dict with any fields found (name, email, phone).
    """
    extracted = {}

    # Email
    email_match = re.search(r"[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}", text)
    if email_match:
        extracted["email"] = email_match.group()

    # UK / international phone numbers  (7–15 digits, optional +/spaces/dashes)
    phone_match = re.search(
        r"(\+?\d[\d\s\-().]{6,14}\d)", text
    )
    if phone_match:
        extracted["phone"] = phone_match.group().strip()

    return extracted


def get_all_leads() -> list:
    """Return all stored leads."""
    return _load_leads()
