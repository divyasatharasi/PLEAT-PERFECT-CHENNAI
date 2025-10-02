# Google Sheets Integration Scripts
# Connects all automation systems with Google Sheets as database

from google.oauth2.service_account import Credentials
from googleapiclient.discovery import build
import pandas as pd
from datetime import datetime, timedelta
import json

class GoogleSheetsDB:
    """
    Google Sheets Database Integration for Pleat Perfect Chennai
    Manages all business data in Google Sheets
    """
    
    def __init__(self, credentials_file, spreadsheet_id):
        self.credentials_file = credentials_file
        self.spreadsheet_id = spreadsheet_id
        self.service = self.authenticate()
        
        # Sheet names configuration
        self.sheets = {
            "customers": "Customers",
            "bookings": "Bookings", 
            "services": "Services",
            "inventory": "Inventory",
            "analytics": "Analytics",
            "follow_ups": "FollowUpQueue",
            "reviews": "Reviews",
            "expenses": "Expenses"
        }
    
    def authenticate(self):
        """Authenticate with Google Sheets API"""
        SCOPES = ['https://www.googleapis.com/auth/spreadsheets']
        
        credentials = Credentials.from_service_account_file(
            self.credentials_file, scopes=SCOPES
        )
        
        service = build('sheets', 'v4', credentials=credentials)
        return service
    
    def create_business_spreadsheet(self):
        """Create complete business management spreadsheet structure"""
        
        # Create main spreadsheet
        spreadsheet_body = {
            'properties': {
                'title': 'Pleat Perfect Chennai - Business Management System'
            }
        }
        
        spreadsheet = self.service.spreadsheets().create(body=spreadsheet_body).execute()
        spreadsheet_id = spreadsheet['spreadsheetId']
        
        # Create all required sheets
        self.setup_customers_sheet(spreadsheet_id)
        self.setup_bookings_sheet(spreadsheet_id)
        self.setup_services_sheet(spreadsheet_id)
        self.setup_inventory_sheet(spreadsheet_id)
        self.setup_analytics_sheet(spreadsheet_id)
        self.setup_followup_sheet(spreadsheet_id)
        self.setup_reviews_sheet(spreadsheet_id)
        self.setup_expenses_sheet(spreadsheet_id)
        
        return spreadsheet_id
    
    def setup_customers_sheet(self, spreadsheet_id):
        """Setup customers data sheet"""
        headers = [
            "Phone", "Name", "Email", "Address", "Stage", "Created Date",
            "Last Service Date", "Total Services", "Total Spent", "Source",
            "Preferences", "Birthday", "VIP Status", "Notes"
        ]
        
        self.create_sheet_with_headers(spreadsheet_id, "Customers", headers)
    
    def setup_bookings_sheet(self, spreadsheet_id):
        """Setup bookings management sheet"""
        headers = [
            "Booking ID", "Customer Phone", "Customer Name", "Service Type",
            "Saree Count", "Booking Date", "Service Date", "Time Slot",
            "Pickup Address", "Status", "Amount", "Payment Status",
            "Assigned Staff", "Notes", "Completion Date"
        ]
        
        self.create_sheet_with_headers(spreadsheet_id, "Bookings", headers)
    
    def setup_services_sheet(self, spreadsheet_id):
        """Setup services tracking sheet"""
        headers = [
            "Service ID", "Booking ID", "Customer Phone", "Service Type",
            "Saree Type", "Special Requirements", "Start Time", "End Time",
            "Quality Score", "Customer Feedback", "Photos", "Staff Notes"
        ]
        
        self.create_sheet_with_headers(spreadsheet_id, "Services", headers)
    
    def setup_inventory_sheet(self, spreadsheet_id):
        """Setup inventory management sheet"""
        headers = [
            "Item Name", "Category", "Current Stock", "Minimum Stock",
            "Unit Cost", "Supplier", "Last Restocked", "Monthly Usage",
            "Status", "Notes"
        ]
        
        self.create_sheet_with_headers(spreadsheet_id, "Inventory", headers)
        
        # Add initial inventory items
        initial_items = [
            ["Dress Form/Mannequin", "Equipment", 3, 2, 5000, "Local Supplier", "", 0, "Good", ""],
            ["Professional Pins", "Supplies", 500, 100, 2, "Online", "", 50, "Good", ""],
            ["Safety Pins", "Supplies", 200, 50, 1, "Local Store", "", 20, "Good", ""],
            ["Steam Iron", "Equipment", 2, 1, 3000, "Electronics Store", "", 0, "Good", ""],
            ["Measuring Tape", "Tools", 5, 2, 50, "Local Store", "", 1, "Good", ""],
            ["Scissors", "Tools", 3, 2, 200, "Local Store", "", 0, "Good", ""],
            ["Thread (Various Colors)", "Supplies", 20, 5, 25, "Textile Shop", "", 5, "Good", ""],
            ["Hangers", "Storage", 50, 20, 15, "Local Store", "", 10, "Good", ""]
        ]
        
        self.append_rows(spreadsheet_id, "Inventory", initial_items)
    
    def setup_analytics_sheet(self, spreadsheet_id):
        """Setup analytics tracking sheet"""
        headers = [
            "Date", "Daily Revenue", "Customer Count", "Basic Services",
            "Premium Services", "Bridal Services", "Website Visitors",
            "WhatsApp Inquiries", "Booking Conversion Rate", "Customer Rating",
            "Reviews Count", "Expenses", "Profit"
        ]
        
        self.create_sheet_with_headers(spreadsheet_id, "Analytics", headers)
    
    def setup_followup_sheet(self, spreadsheet_id):
        """Setup follow-up automation sheet"""
        headers = [
            "Customer Phone", "Customer Name", "Follow-up Type", "Scheduled Date",
            "Message", "Status", "Sent Date", "Response", "Next Action"
        ]
        
        self.create_sheet_with_headers(spreadsheet_id, "FollowUpQueue", headers)
    
    def setup_reviews_sheet(self, spreadsheet_id):
        """Setup reviews tracking sheet"""
        headers = [
            "Date", "Customer Phone", "Customer Name", "Platform",
            "Rating", "Review Text", "Response", "Response Date",
            "Service Date", "Follow-up Needed"
        ]
        
        self.create_sheet_with_headers(spreadsheet_id, "Reviews", headers)
    
    def setup_expenses_sheet(self, spreadsheet_id):
        """Setup expenses tracking sheet"""
        headers = [
            "Date", "Category", "Description", "Amount", "Payment Method",
            "Vendor", "Receipt", "Tax Deductible", "Notes"
        ]
        
        self.create_sheet_with_headers(spreadsheet_id, "Expenses", headers)
        
        # Add expense categories
        categories = [
            ["Rent", "Monthly workshop rent", 12000, "Bank Transfer", "Landlord", "", "Yes", ""],
            ["Utilities", "Electricity, water", 2000, "Online", "TNEB/Metro Water", "", "Yes", ""],
            ["Supplies", "Pins, thread, etc.", 1000, "Cash", "Various", "", "Yes", "Monthly restocking"],
            ["Transportation", "Pickup/delivery fuel", 1500, "Cash", "Petrol Pump", "", "Yes", ""],
            ["Marketing", "Social media ads", 3000, "Online", "Facebook/Google", "", "Yes", ""],
            ["Insurance", "Business insurance", 1500, "Bank Transfer", "Insurance Company", "", "Yes", "Annual"],
            ["Equipment Maintenance", "Iron, mannequin repair", 500, "Cash", "Local Repair", "", "Yes", "As needed"]
        ]
        
        # Add sample expense entries for current month
        today = datetime.now()
        for i, category_data in enumerate(categories):
            date = (today - timedelta(days=i*2)).strftime("%Y-%m-%d")
            expense_row = [date] + category_data
            self.append_rows(spreadsheet_id, "Expenses", [expense_row])
    
    def create_sheet_with_headers(self, spreadsheet_id, sheet_name, headers):
        """Create a new sheet with headers"""
        # Add new sheet
        requests = [{
            'addSheet': {
                'properties': {
                    'title': sheet_name
                }
            }
        }]
        
        self.service.spreadsheets().batchUpdate(
            spreadsheetId=spreadsheet_id,
            body={'requests': requests}
        ).execute()
        
        # Add headers
        self.update_range(spreadsheet_id, f"{sheet_name}!A1:Z1", [headers])
        
        # Format headers
        self.format_headers(spreadsheet_id, sheet_name, len(headers))
    
    def format_headers(self, spreadsheet_id, sheet_name, header_count):
        """Format header row with styling"""
        requests = [{
            'repeatCell': {
                'range': {
                    'sheetId': self.get_sheet_id(spreadsheet_id, sheet_name),
                    'startRowIndex': 0,
                    'endRowIndex': 1,
                    'startColumnIndex': 0,
                    'endColumnIndex': header_count
                },
                'cell': {
                    'userEnteredFormat': {
                        'backgroundColor': {
                            'red': 0.8,
                            'green': 0.2,
                            'blue': 0.5
                        },
                        'textFormat': {
                            'foregroundColor': {
                                'red': 1.0,
                                'green': 1.0,
                                'blue': 1.0
                            },
                            'bold': True
                        }
                    }
                },
                'fields': 'userEnteredFormat(backgroundColor,textFormat)'
            }
        }]
        
        self.service.spreadsheets().batchUpdate(
            spreadsheetId=spreadsheet_id,
            body={'requests': requests}
        ).execute()
    
    def get_sheet_id(self, spreadsheet_id, sheet_name):
        """Get sheet ID by name"""
        spreadsheet = self.service.spreadsheets().get(spreadsheetId=spreadsheet_id).execute()
        for sheet in spreadsheet['sheets']:
            if sheet['properties']['title'] == sheet_name:
                return sheet['properties']['sheetId']
        return None
    
    def append_rows(self, spreadsheet_id, sheet_name, rows):
        """Append rows to a sheet"""
        range_name = f"{sheet_name}!A:Z"
        
        body = {
            'values': rows
        }
        
        result = self.service.spreadsheets().values().append(
            spreadsheetId=spreadsheet_id,
            range=range_name,
            valueInputOption='USER_ENTERED',
            body=body
        ).execute()
        
        return result
    
    def update_range(self, spreadsheet_id, range_name, values):
        """Update specific range with values"""
        body = {
            'values': values
        }
        
        result = self.service.spreadsheets().values().update(
            spreadsheetId=spreadsheet_id,
            range=range_name,
            valueInputOption='USER_ENTERED',
            body=body
        ).execute()
        
        return result
    
    def read_range(self, spreadsheet_id, range_name):
        """Read data from a range"""
        result = self.service.spreadsheets().values().get(
            spreadsheetId=spreadsheet_id,
            range=range_name
        ).execute()
        
        values = result.get('values', [])
        return values
    
    def add_customer(self, customer_data):
        """Add new customer to database"""
        row = [
            customer_data.get('phone', ''),
            customer_data.get('name', ''),
            customer_data.get('email', ''),
            customer_data.get('address', ''),
            customer_data.get('stage', 'lead'),
            datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
            '',  # Last service date
            0,   # Total services
            0,   # Total spent
            customer_data.get('source', 'unknown'),
            customer_data.get('preferences', ''),
            customer_data.get('birthday', ''),
            'No',  # VIP status
            customer_data.get('notes', '')
        ]
        
        return self.append_rows(self.spreadsheet_id, "Customers", [row])
    
    def add_booking(self, booking_data):
        """Add new booking to database"""
        booking_id = f"PPC{datetime.now().strftime('%Y%m%d%H%M')}"
        
        row = [
            booking_id,
            booking_data.get('customer_phone', ''),
            booking_data.get('customer_name', ''),
            booking_data.get('service_type', ''),
            booking_data.get('saree_count', 1),
            datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
            booking_data.get('service_date', ''),
            booking_data.get('time_slot', ''),
            booking_data.get('pickup_address', ''),
            'Confirmed',
            booking_data.get('amount', 0),
            'Pending',
            booking_data.get('assigned_staff', ''),
            booking_data.get('notes', ''),
            ''  # Completion date
        ]
        
        return self.append_rows(self.spreadsheet_id, "Bookings", [row])
    
    def update_daily_analytics(self, analytics_data):
        """Update daily analytics data"""
        today = datetime.now().strftime("%Y-%m-%d")
        
        row = [
            today,
            analytics_data.get('revenue', 0),
            analytics_data.get('customer_count', 0),
            analytics_data.get('basic_services', 0),
            analytics_data.get('premium_services', 0),
            analytics_data.get('bridal_services', 0),
            analytics_data.get('website_visitors', 0),
            analytics_data.get('whatsapp_inquiries', 0),
            analytics_data.get('conversion_rate', 0),
            analytics_data.get('average_rating', 0),
            analytics_data.get('reviews_count', 0),
            analytics_data.get('expenses', 0),
            analytics_data.get('profit', 0)
        ]
        
        return self.append_rows(self.spreadsheet_id, "Analytics", [row])
    
    def get_customer_data(self, phone_number):
        """Get customer data by phone number"""
        customers = self.read_range(self.spreadsheet_id, "Customers!A:N")
        
        for row in customers[1:]:  # Skip header
            if len(row) > 0 and row[0] == phone_number:
                return {
                    'phone': row[0],
                    'name': row[1] if len(row) > 1 else '',
                    'email': row[2] if len(row) > 2 else '',
                    'address': row[3] if len(row) > 3 else '',
                    'stage': row[4] if len(row) > 4 else 'lead',
                    'created_date': row[5] if len(row) > 5 else '',
                    'last_service_date': row[6] if len(row) > 6 else '',
                    'total_services': int(row[7]) if len(row) > 7 and row[7].isdigit() else 0,
                    'total_spent': float(row[8]) if len(row) > 8 and row[8].replace('.','').isdigit() else 0,
                    'source': row[9] if len(row) > 9 else '',
                    'preferences': row[10] if len(row) > 10 else '',
                    'birthday': row[11] if len(row) > 11 else '',
                    'vip_status': row[12] if len(row) > 12 else 'No',
                    'notes': row[13] if len(row) > 13 else ''
                }
        
        return None
    
    def get_monthly_summary(self):
        """Get monthly business summary"""
        current_month = datetime.now().strftime("%Y-%m")
        analytics_data = self.read_range(self.spreadsheet_id, "Analytics!A:M")
        
        monthly_data = {
            'total_revenue': 0,
            'total_customers': 0,
            'total_services': 0,
            'average_rating': 0,
            'total_expenses': 0
        }
        
        monthly_rows = []
        for row in analytics_data[1:]:  # Skip header
            if len(row) > 0 and row[0].startswith(current_month):
                monthly_rows.append(row)
        
        if monthly_rows:
            for row in monthly_rows:
                monthly_data['total_revenue'] += float(row[1]) if len(row) > 1 and row[1].replace('.','').isdigit() else 0
                monthly_data['total_customers'] += int(row[2]) if len(row) > 2 and row[2].isdigit() else 0
                monthly_data['total_services'] += (
                    (int(row[3]) if len(row) > 3 and row[3].isdigit() else 0) +
                    (int(row[4]) if len(row) > 4 and row[4].isdigit() else 0) +
                    (int(row[5]) if len(row) > 5 and row[5].isdigit() else 0)
                )
                monthly_data['total_expenses'] += float(row[11]) if len(row) > 11 and row[11].replace('.','').isdigit() else 0
            
            # Calculate average rating
            ratings = [float(row[9]) for row in monthly_rows if len(row) > 9 and row[9].replace('.','').isdigit() and float(row[9]) > 0]
            monthly_data['average_rating'] = sum(ratings) / len(ratings) if ratings else 0
        
        return monthly_data
    
    def create_formulas_and_charts(self, spreadsheet_id):
        """Add formulas and charts for automatic calculations"""
        
        # Add summary formulas to Analytics sheet
        summary_formulas = [
            ["Monthly Revenue", "=SUMIF(A:A,\">=\"&DATE(YEAR(TODAY()),MONTH(TODAY()),1),B:B)"],
            ["Monthly Customers", "=SUMIF(A:A,\">=\"&DATE(YEAR(TODAY()),MONTH(TODAY()),1),C:C)"],
            ["Average Rating", "=AVERAGEIF(J:J,\">0\",J:J)"],
            ["Conversion Rate", "=AVERAGE(I:I)"]
        ]
        
        # Add summary section
        self.update_range(spreadsheet_id, "Analytics!O1:P4", summary_formulas)

# Usage example and setup script
def setup_business_automation():
    """Complete setup script for business automation"""
    
    # Initialize Google Sheets database
    # Note: You'll need to create a service account and download credentials
    db = GoogleSheetsDB(
        credentials_file="path/to/service-account-credentials.json",
        spreadsheet_id="your-spreadsheet-id"
    )
    
    # Create the complete spreadsheet structure
    spreadsheet_id = db.create_business_spreadsheet()
    print(f"Business spreadsheet created: {spreadsheet_id}")
    
    # Add sample data for testing
    sample_customer = {
        'phone': '+919876543210',
        'name': 'Priya Sharma',
        'email': 'priya@email.com',
        'address': 'Phoenix Apartments, Velachery',
        'source': 'website',
        'preferences': 'Prefers premium service'
    }
    
    db.add_customer(sample_customer)
    
    sample_booking = {
        'customer_phone': '+919876543210',
        'customer_name': 'Priya Sharma',
        'service_type': 'Premium',
        'saree_count': 2,
        'service_date': '2025-10-01',
        'time_slot': 'Morning',
        'pickup_address': 'Phoenix Apartments, Velachery',
        'amount': 800
    }
    
    db.add_booking(sample_booking)
    
    print("Sample data added successfully!")
    print(f"Access your business dashboard at: https://docs.google.com/spreadsheets/d/{spreadsheet_id}")

if __name__ == "__main__":
    setup_business_automation()