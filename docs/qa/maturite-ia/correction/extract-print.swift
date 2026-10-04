import Foundation
import PDFKit
let path = CommandLine.arguments[1]
guard let document = PDFDocument(url: URL(fileURLWithPath: path)) else { fatalError("PDF illisible") }
for index in 0..<document.pageCount {
    if let text = document.page(at: index)?.string { print(text) }
}
