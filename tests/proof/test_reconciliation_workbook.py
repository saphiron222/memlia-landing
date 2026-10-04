import unittest
from pathlib import Path
from zipfile import ZipFile
from xml.etree import ElementTree as ET

ROOT = Path(__file__).resolve().parents[2]
NS = {'s': 'http://schemas.openxmlformats.org/spreadsheetml/2006/main'}

class ReconciliationWorkbookTests(unittest.TestCase):
    def test_real_workbook_with_example_blank_inputs_and_formulas(self):
        with ZipFile(ROOT / 'public/downloads/modele-rapprochement-bancaire.xlsx') as archive:
            self.assertIsNone(archive.testzip())
            self.assertFalse(any('vba' in n.lower() or 'externallink' in n.lower() for n in archive.namelist()))
            book = ET.fromstring(archive.read('xl/workbook.xml'))
            self.assertEqual([s.attrib['name'] for s in book.findall('s:sheets/s:sheet', NS)], ['Notice', 'Exemple fictif', 'À remplir'])
            for number in (2, 3):
                sheet = ET.fromstring(archive.read(f'xl/worksheets/sheet{number}.xml'))
                cells = {c.attrib['r']: c for c in sheet.findall('.//s:c', NS)}
                for cell, formula in {'B19': 'ROUND(B8+B11-B12,2)', 'B20': 'ROUND(B9-B14+B15,2)', 'B22': 'ROUND(B19-B20,2)'}.items():
                    self.assertEqual(cells[cell].findtext('s:f', namespaces=NS), formula)
                self.assertIn('NON VALIDÉ', cells['B24'].findtext('s:f', default='', namespaces=NS))
                self.assertIn('COUNT(', cells['B24'].findtext('s:f', default='', namespaces=NS))
                if number == 3:
                    for cell in ('B5', 'B6', 'B8', 'B9', 'B11', 'B12', 'B14', 'B15', 'B17'):
                        self.assertTrue(cell not in cells or cells[cell].find('s:v', NS) is None)

if __name__ == '__main__':
    unittest.main()
