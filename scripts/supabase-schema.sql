-- Create attendance table
CREATE TABLE IF NOT EXISTS attendance (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  date DATE NOT NULL,
  check_in TIME,
  check_out TIME,
  status TEXT NOT NULL CHECK (status IN ('Present', 'Absent', 'Half Day', 'Late')),
  hours TEXT NOT NULL DEFAULT '0h',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(name, date)
);

-- Create inventory table
CREATE TABLE IF NOT EXISTS inventory (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  category TEXT NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 0,
  min_stock INTEGER NOT NULL DEFAULT 0,
  unit TEXT NOT NULL,
  status TEXT NOT NULL,
  last_updated TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create inventory_history table
CREATE TABLE IF NOT EXISTS inventory_history (
  id BIGSERIAL PRIMARY KEY,
  inventory_id BIGINT REFERENCES inventory(id) ON DELETE CASCADE,
  action TEXT NOT NULL CHECK (action IN ('added', 'removed', 'updated')),
  quantity INTEGER NOT NULL,
  previous_quantity INTEGER,
  reason TEXT NOT NULL,
  updated_by TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_attendance_date ON attendance(date);
CREATE INDEX IF NOT EXISTS idx_attendance_name ON attendance(name);
CREATE INDEX IF NOT EXISTS idx_inventory_category ON inventory(category);
CREATE INDEX IF NOT EXISTS idx_inventory_status ON inventory(status);
CREATE INDEX IF NOT EXISTS idx_inventory_history_inventory_id ON inventory_history(inventory_id);
CREATE INDEX IF NOT EXISTS idx_inventory_history_created_at ON inventory_history(created_at);

-- Enable Row Level Security (RLS)
ALTER TABLE attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory_history ENABLE ROW LEVEL SECURITY;

-- Create policies (allow all operations for now - you can restrict these later)
CREATE POLICY "Allow all operations on attendance" ON attendance FOR ALL USING (true);
CREATE POLICY "Allow all operations on inventory" ON inventory FOR ALL USING (true);
CREATE POLICY "Allow all operations on inventory_history" ON inventory_history FOR ALL USING (true);

-- Insert default data
INSERT INTO attendance (name, role, date, check_in, check_out, status, hours) VALUES
('Dr. Bhajan Singh', 'Chief Radiologist', CURRENT_DATE, '08:00', '18:00', 'Present', '10h'),
('Dr. Priya Sharma', 'Senior Radiologist', CURRENT_DATE, '08:30', '17:30', 'Present', '9h'),
('Rajesh Kumar', 'Chief Technologist', CURRENT_DATE, '07:45', '16:45', 'Present', '9h'),
('Sunita Patel', 'MRI Technician', CURRENT_DATE, '09:15', '18:15', 'Late', '9h'),
('Amit Verma', 'CT Technician', CURRENT_DATE, NULL, NULL, 'Absent', '0h'),
('Neha Gupta', 'Ultrasound Technician', CURRENT_DATE, '08:15', '17:15', 'Present', '9h')
ON CONFLICT (name, date) DO NOTHING;

INSERT INTO inventory (name, category, quantity, min_stock, unit, status) VALUES
('Contrast Dye', 'Medical Supplies', 5, 20, 'Bottles', 'Low Stock'),
('X-Ray Films', 'Imaging Supplies', 15, 50, 'Boxes', 'Low Stock'),
('Ultrasound Gel', 'Medical Supplies', 8, 25, 'Tubes', 'Low Stock'),
('Disposable Gloves', 'Safety Equipment', 45, 100, 'Boxes', 'Low Stock'),
('Lead Aprons', 'Safety Equipment', 8, 15, 'Units', 'Low Stock')
ON CONFLICT (name) DO NOTHING;

-- Insert initial inventory history
INSERT INTO inventory_history (inventory_id, action, quantity, reason, updated_by)
SELECT id, 'added', quantity, 'Initial stock', 'System'
FROM inventory
WHERE NOT EXISTS (
  SELECT 1 FROM inventory_history WHERE inventory_id = inventory.id
);
