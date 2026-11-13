// Writes the subject mask of a photo (white = pen), at the photo's full size, with Apple Vision.
// Usage: swift mask.swift <photo> <mask.png> (make-cutout.py runs it; macOS 14 or later)
import CoreImage
import Foundation
import Vision

let args = CommandLine.arguments
guard args.count == 3 else { fputs("usage: mask <photo> <mask.png>\n", stderr); exit(2) }
let handler = VNImageRequestHandler(url: URL(fileURLWithPath: args[1]), options: [:])
let request = VNGenerateForegroundInstanceMaskRequest()
try handler.perform([request])
guard let result = request.results?.first else { fputs("no subject found in \(args[1])\n", stderr); exit(1) }
let buffer = try result.generateScaledMaskForImage(forInstances: result.allInstances, from: handler)
// No colour management: the mask values must reach the file unchanged.
let context = CIContext(options: [.workingColorSpace: NSNull(), .outputColorSpace: NSNull()])
try context.writePNGRepresentation(
  of: CIImage(cvPixelBuffer: buffer), to: URL(fileURLWithPath: args[2]), format: .L8,
  colorSpace: CGColorSpace(name: CGColorSpace.linearGray)!)
print("instances=\(result.allInstances.count) size=\(CVPixelBufferGetWidth(buffer))x\(CVPixelBufferGetHeight(buffer))")
